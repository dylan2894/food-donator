package com.fooddonator.restapi.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.repository.UserRepository;
import com.fooddonator.restapi.utils.JwtTokenUtil;
import java.nio.charset.StandardCharsets;
import java.security.spec.KeySpec;
import java.util.Base64;

import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;

@Service
public class AuthenticationService {

  private Logger logger = LogManager.getLogger(AuthenticationService.class);
  
  @Autowired
  private UserRepository userRepo;
  @Autowired
  private JwtTokenUtil jwtTokenUtil;

  /**
   * Attempts to login using the user's phone number and password
   * @param _phone_num the user's phone number
   * @param _password the user's password
   * @return a JWT token if login is successful, else it will return null
   */
  public String login(String _phone_num, String _password) {
    User user = this.userRepo.getUserByPhoneNum(_phone_num);

    if(this.isPasswordCorrect(user, _password)) {
      // generate a token with the subject being the phone_num and the 'aud' claim being either 'donor' or 'donee'
      if("donor".equals(user.type)) {
        return this.jwtTokenUtil.generateTokenForDonor(_phone_num);
      } else if ("donee".equals(user.type)) {
        return this.jwtTokenUtil.generateTokenForDonee(_phone_num);
      }
      logger.warn("No user type provided.");
    }
    logger.error("Login unsuccessful. Password incorrect");
    return null;
  }

  /**
   * Validates whether a JWT is valid or not and whether the user is a Donor
   * @param jwt the candidate JWT token to validate
   * @return true if the provided JWT is valid and the user is a Donor, false otherwise
   */
  public Boolean isJwtValidForDonor(String jwt) {
    if(jwt == null || "".equals(jwt)) {
      logger.warn("JWT is null or empty.");
      return false;
    }
    return this.jwtTokenUtil.validateTokenForDonor(jwt);
  }

  /**
   * Validates whether a JWT is valid or not and whether the user is a Donee
   * @param jwt the candidate JWT token to validate
   * @return true if the provided JWT is valid and the user is a Donee, false otherwise
   */
  public Boolean isJwtValidForDonee(String jwt) {
    if(jwt == null || "".equals(jwt)) {
      logger.warn("JWT is null or empty.");
      return false;
    }
    return this.jwtTokenUtil.validateTokenForDonee(jwt);
  }

  public User getUserByJWT(String jwt) {
    String phoneNum = this.jwtTokenUtil.getPhoneNumFromToken(jwt);
    if(phoneNum == null) {
      return null;
    }
    return this.userRepo.getUserByPhoneNum(phoneNum);
  }

  /**
   * Hashes the provided plaintext password 
   * and then compares the result with the stored hash in the DB
   * @param user the user from the DB which corresponds to the phone number provided upon login
   * @param candidatePassword the plaintext candidate password provided upon login
   * @return a boolean indicating whether the provided password matches the stored password
   */
  private boolean isPasswordCorrect(User user, String candidatePassword) {            
    if(user == null){
      logger.warn("Could not find user by phone number.");
      return false;
    }

    // Base64 decode the corresponding user's salt
    byte[] decodedUserSalt = Base64.getDecoder().decode(user.salt);

    // hash the candidate password along with the user's salt
    byte[] hash = "".getBytes(StandardCharsets.UTF_8);
    KeySpec spec = new PBEKeySpec(candidatePassword.toCharArray(), decodedUserSalt, 65536, 128);
    try {
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
      hash = factory.generateSecret(spec).getEncoded();
    } catch (Exception e) {
      logger.error(e);
    }

    // Base64 encode the hashed candidate password
    String encodedHashedCandidatePassword = Base64.getEncoder().encodeToString(hash);

    // compare the encoded hashed candidate password to the user's encoded password hash stored in the DB
    if(user.password.equals(encodedHashedCandidatePassword)) {
      return true;
    }

    logger.warn("Password is incorrect.");
    return false;
  }

}
