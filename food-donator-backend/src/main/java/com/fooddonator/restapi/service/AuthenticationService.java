package com.fooddonator.restapi.service;

import java.util.Arrays;
import java.util.Map;
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
    if(this.isPasswordCorrect(_phone_num, _password)) {
      return this.jwtTokenUtil.generateToken(_phone_num);  // generate a token with the subject being the phone_num
    }
    System.out.println("[AUTH SERVICE] Login unsuccessful.");
    return null;
  }

  /**
   * Validates whether a JWT is valid or not
   * @param jwt the candidate JWT token to validate
   * @return true if the provided JWT is valid, false otherwise
   */
  public Boolean isJwtValid(String jwt) {
    if(jwt == null || "".equals(jwt)) {
      System.out.println("[AUTH SERVICE] JWT is null or empty.");
      return false;
    }
    return this.jwtTokenUtil.validateToken(jwt);
  }

  /**
   * Hashes the provided plaintext password 
   * and then compares the result with the stored hash in the DB
   * @param 
   * @return a boolean indicating whether the provided password matches the stored password
   */
  private boolean isPasswordCorrect(String phoneNum, String candidatePassword) {        
    // 1. get the user which matches the provided phoneNum
    User user = this.userRepo.getUserByPhoneNum(phoneNum);
    if(user == null){
      System.out.println("[AUTH SERVICE] could not find user by phone number.");
      return false;
    }

    // 2. hash the candidate password
    byte[] hash = "".getBytes(StandardCharsets.UTF_8);
    KeySpec spec = new PBEKeySpec(candidatePassword.toCharArray(), user.salt.getBytes(StandardCharsets.UTF_8), 65536, 128);
    try {
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
      hash = factory.generateSecret(spec).getEncoded();
    } catch (Exception e) {
      System.out.println(e);
    }

    // 3. compare the hashed candidate password to the user's password hash stored in the DB
    if(user.password.equals(new String(hash, StandardCharsets.UTF_8))) {
      return true;
    }

    System.out.println("[AUTH SERVICE] password is incorrect.");
    return false;
  }

}
