package com.fooddonator.restapi.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.model.UserSettings;
import com.fooddonator.restapi.repository.UserRepository;
import com.fooddonator.restapi.repository.UserSettingsRepository;

import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Base64;

import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;

@Service
public class RegistrationService {

  private Logger logger = LogManager.getLogger(RegistrationService.class);

  @Autowired
  private UserRepository userRepo;
  @Autowired
  private UserSettingsRepository userSettingsRepo;

  /**
   * creates a hash of the provided password for storage 
   * and then creates a new {@link User} in the User table within the DB
   * and then creates a new {@link UserSettings} for the corresponding new user in the UserSettings table within the DB
   * @param candidatePassword the password of the new User to register
   */
  public boolean registerUser(User userInput) throws Exception {
    // 1. create a random salt
    SecureRandom random = new SecureRandom();
    byte[] newSalt = new byte[16];
    random.nextBytes(newSalt);
    
    // 2. hash the password
    byte[] hashedPassword;
    try {
      hashedPassword = this.createPasswordHash(userInput.password, newSalt);
    } catch (Exception e) {
      throw e;
    }

    // convert hashedPassword and newSalt to Base64 encoded strings
    String encodedHashedPassword = Base64.getEncoder().encodeToString(hashedPassword);
    String encodedNewSalt = Base64.getEncoder().encodeToString(newSalt);

    // 3. set the new password to be the Base64-encoded password hash
    userInput.password = encodedHashedPassword;

    // 4. save the Base64-encoded password salt
    userInput.salt = encodedNewSalt;

    try {
      // 5. create a new user in the DB
      this.userRepo.createUser(userInput);

      // 6. create a new user settings entry in the DB
      UserSettings userSettings = new UserSettings(userInput.phone_num, true, true, true, false);
      this.userSettingsRepo.createUserSettings(userSettings);
      
    } catch (Exception e) {
      throw e;
    }

    logger.info("registerUser completed.");
    return true;
  }

  /**
   * creates a salted hash for the provided password using the PBKDF2 algorithm
   * @param password the user defined plaintext password
   * @return salted and hashed result of provided password
     * @throws Exception
   */
  private byte[] createPasswordHash(String password, byte[] salt) throws Exception {  
    byte[] hash;

    // 2. create a password hash using PBKDF2 algorithm 
    KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 65536, 128);
    try {
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
      hash = factory.generateSecret(spec).getEncoded();
    } catch (Exception e) {
      logger.error("Failed to hash password.", e);
      throw e;
    }

    return hash;
  }
  
}
