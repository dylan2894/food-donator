package com.fooddonator.restapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.repository.UserRepository;
import com.fooddonator.restapi.utils.JwtTokenUtil;
import java.nio.charset.StandardCharsets;
import java.security.spec.KeySpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;

@Service
public class AuthenticationService {
  
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
      System.out.println("[AUTH SERVICE] no user type provided.");
    }
    System.out.println("[AUTH SERVICE] Login unsuccessful.");
    return null;
  }

  /**
   * Validates whether a JWT is valid or not and whether the user is a Donor
   * @param jwt the candidate JWT token to validate
   * @return true if the provided JWT is valid and the user is a Donor, false otherwise
   */
  public Boolean isJwtValidForDonor(String jwt) {
    if(jwt == null || "".equals(jwt)) {
      System.out.println("[AUTH SERVICE] JWT is null or empty.");
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
      System.out.println("[AUTH SERVICE] JWT is null or empty.");
      return false;
    }
    return this.jwtTokenUtil.validateTokenForDonee(jwt);
  }

  /**
   * Hashes the provided plaintext password 
   * and then compares the result with the stored hash in the DB
   * @param 
   * @return a boolean indicating whether the provided password matches the stored password
   */
  private boolean isPasswordCorrect(User user, String candidatePassword) {            
    if(user == null){
      System.out.println("[AUTH SERVICE] could not find user by phone number.");
      return false;
    }

    // hash the candidate password
    byte[] hash = "".getBytes(StandardCharsets.UTF_8);
    KeySpec spec = new PBEKeySpec(candidatePassword.toCharArray(), user.salt, 65536, 128);
    try {
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
      hash = factory.generateSecret(spec).getEncoded();
    } catch (Exception e) {
      System.out.println(e);
    }

    // compare the hashed candidate password to the user's password hash stored in the DB
    if(user.password == hash) {
      return true;
    }

    System.out.println("[AUTH SERVICE] password is incorrect.");
    System.out.println("Stored password is: " + user.password.toString());
    System.out.println("Hashed candidate password is: " + hash.toString());
    return false;
  }

}
