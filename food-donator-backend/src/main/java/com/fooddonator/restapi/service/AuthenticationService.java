package com.fooddonator.restapi.service;

import java.util.Arrays;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.repository.DoneeRepository;
import com.fooddonator.restapi.repository.DonorRepository;
import java.security.spec.KeySpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;

@Service
public class AuthenticationService {
  
  @Autowired
  private DonorRepository donorRepository;
  @Autowired
  private DoneeRepository doneeRepository;

  /**
   * Hashes the provided plaintext password 
   * and then compares the result with the stored hash in the DB
   * @param 
   * @return a boolean indicating whether the provided password matches the stored password
   */
  private boolean isPasswordCorrect(String phoneNum, String candidatePassword) {
    User user;
    
    // 1. get the user which matches the provided phoneNum
    // 1.1 try query the Donor table
    Map<String, Object> result = this.donorRepository.getDonorByPhoneNum(phoneNum);
    if(result.containsKey("id")) {
      user = (User) result;
    }
    else {
      // 1.2 if user not found, try query the Donee table
      result = this.doneeRepository.getDoneeByPhoneNum(phoneNum);
      if(result.containsKey("id")) {
        user = (User) result;
      }
      else {
        System.out.println("[AUTH SERVICE] could not find user by phone number.");
        return false;
      }
    }

    // 2. hash the candidate password
    byte[] hash = "".getBytes();
    KeySpec spec = new PBEKeySpec(candidatePassword.toCharArray(), user.salt.getBytes(), 65536, 128);
    try {
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
      hash = factory.generateSecret(spec).getEncoded();
    } catch (Exception e) {
      System.out.println(e);
    }

    // 3. compare the hashed candidate password to the user's password hash stored in the DB
    if(user.password.equals(Arrays.toString(hash))) {
      return true;
    }

    return false;
  }

  /**
   * Attempts to login using the user's phone number and password
   * @param _phone_num the user's phone number
   * @param _password the user's password
   * @return a JWT token if login is successful, else it will return an empty string
   */
  public String login(String _phone_num, String _password) {
    if(this.isPasswordCorrect(_phone_num, _password)) {
      //TODO generate a JWT and return it 

    }
    System.out.println("[AUTH SERVICE] Login unsuccessful.");
    return "";
  }

  /**
   * Validates whether a JWT is valid or not
   * @param jwt the candidate JWT token to validate
   * @return true if the provided JWT is valid, false otherwise
   */
  public boolean isJwtValid(String jwt) {
    //TODO check if jwt is valid, then return true or false

    return false;
  }
}
