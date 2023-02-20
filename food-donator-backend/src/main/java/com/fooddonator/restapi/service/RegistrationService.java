package com.fooddonator.restapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fooddonator.restapi.model.Donor;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.repository.DoneeRepository;
import com.fooddonator.restapi.repository.DonorRepository;
import com.fooddonator.restapi.repository.UserRepository;
import com.fooddonator.restapi.model.Donee;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Arrays;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;

@Service
public class RegistrationService {

  @Autowired
  private UserRepository userRepo;
  @Autowired
  private DonorRepository donorRepository;
  @Autowired
  private DoneeRepository doneeRepository;
  
  /**
   * creates a hash of the provided password for storage 
   * and then creates a new {@link User} in the User table within the DB
   * @param user the new User to register on the system
   */
  public boolean registerUser(User user) throws Exception {
    // 1. create a random salt
    SecureRandom random = new SecureRandom();
    byte[] newSalt = new byte[16];
    random.nextBytes(newSalt);
    
    // 2. hash the password
    byte[] hashedPassword = this.createPasswordHash(user.password, newSalt);

    // 3. set the new password to be the password hash
    user.password = new String(hashedPassword, StandardCharsets.UTF_8);

    // 4. save the password salt
    user.salt = new String(newSalt, StandardCharsets.UTF_8);

    // 5. create a new user in the DB
    try {
      this.userRepo.createUser(user);
      System.out.println("[REGISTRATION SERVICE] registerUser() completed.");
    } catch (Exception e) {
      throw e;
    }

    return true;
  }

  /**
   * creates a hash of the provided password for storage 
   * and then creates a new donor in the Donor table within the DB
   * @param donor the new donor to register on the system
   */
  public void registerDonor(Donor donor) {
    // 1. create a random salt
    SecureRandom random = new SecureRandom();
    byte[] newSalt = new byte[16];
    random.nextBytes(newSalt);
    
    // 2. hash the password
    byte[] hashedPassword = this.createPasswordHash(donor.password, newSalt);

    // 3. set the new password to be the password hash
    donor.password = Arrays.toString(hashedPassword);

    // 4. save the password salt
    donor.salt = Arrays.toString(newSalt);

    // 5. create a new donor in the DB
    this.donorRepository.createDonor(donor);
    System.out.println("[REGISTRATION SERVICE] registerDonor()");
  }

  /**
   * creates a hashed password for a new {@link Donee} 
   * and then creates the new {@link Donee} in the DB 
   * @param donee the new donee to create on the system
   */
  public void registerDonee(Donee donee) {
    // 1. create a random salt
    SecureRandom random = new SecureRandom();
    byte[] newSalt = new byte[16];
    random.nextBytes(newSalt);

    // 2. hash the password
    byte[] hashedPassword = this.createPasswordHash(donee.password, newSalt);

    // 3. set the new password to be the password hash
    donee.password = Arrays.toString(hashedPassword);

    // 4. save the password salt
    donee.salt = Arrays.toString(newSalt);

    // 5. create a new donee in the DB
    this.doneeRepository.createDonee(donee);
    System.out.println("[REGISTRATION SERVICE] registerDonee()");
  }

    /**
   * creates a salted hash for the provided password using the PBKDF2 algorithm
   * @param password the user defined plaintext password
   * @return salted and hashed result of provided password
   */
  private byte[] createPasswordHash(String password, byte[] salt) {  
    byte[] hash;

    // 2. create a password hash using PBKDF2 algorithm 
    KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 65536, 128);
    try {
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
      hash = factory.generateSecret(spec).getEncoded();
    } catch (Exception e) {
      System.out.println(e);
      return null;
    }

    return hash;
  }
  
}
