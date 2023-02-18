package com.fooddonator.restapi.controller;

import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddonator.restapi.repository.DoneeRepository;
import com.fooddonator.restapi.repository.DonorRepository;
import com.fooddonator.restapi.service.AuthenticationService;
import com.google.api.Http;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/authenticate")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
public class AuthenticationController {
  
  AuthenticationController() {}

  @Autowired
  private AuthenticationService authenticationService;
  @Autowired
  private DonorRepository donorRepo;
  @Autowired
  private DoneeRepository doneeRepo;

  /**
   * Authenticates the given phone number and password. Returns a JWT if successful, otherwise an empty string.
   * @param body a JSON post http request body with 'phone_num' and 'password' as keys
   * @return A map containing a 'token' key and a JWT token if successful. Else, an empty string.
   */
  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> authenticate(@RequestBody Map<String, String> body) {
    //return new ResponseEntity<>(new HashMap(), HttpStatus.OK);
    //TODO remove this temporary stub above

    String phone_num = body.get("phone_num");
    String password = body.get("password");

    String jwt = this.authenticationService.login(phone_num, password);
    Map<String, String> result = new HashMap<>();
    result.put("token", jwt);

    if(jwt.equals("")) {
      return new ResponseEntity<>(result, HttpStatus.UNAUTHORIZED);
    }

    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping("/validateJwt")
  public ResponseEntity<Map<String, Boolean>> validateJwt(@RequestBody Map<String, String> body) {

    // Map<String, Boolean> resp = new HashMap();
    // resp.put("status", true);
    // return new ResponseEntity<>(resp, HttpStatus.OK);
    //TODO remove this temporary stub above
    
    String jwt = body.get("jwt");
    
    Map<String, Boolean> result = new HashMap<>();
    if(Boolean.TRUE.equals(this.authenticationService.isJwtValid(jwt))) {
      result.put("status", true);
      return new ResponseEntity<>(result, HttpStatus.OK);
    }

    result.put("status", false);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  /**
   * Determines whether the user associated with the provided phone number is a Donor or a Donee or none.
   * @param phone_num The user's phone number
   * @return A map containing a 'type' key with either 'donor', 'donee' or 'none' 
   */
  @PostMapping("/type")
  public ResponseEntity<Map<String, String>> determineType(@RequestBody Map<String, String> body) {
    Map result = new HashMap<>();

    // 1. check if user is a donor
    String phone_num = body.get("phone_num");
    Map response = this.donorRepo.getDonorByPhoneNum(phone_num);

    if(response.containsKey("id")) {
      result.put("type", "donor");
      return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // 2. else, check if user is donee
    response = this.doneeRepo.getDoneeByPhoneNum(phone_num);
    if(response.containsKey("id")) {
      result.put("type", "donee");
      return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // 3. else, return 'type': 'none'
    result.put("type", "none");
    return new ResponseEntity<>(result, HttpStatus.OK);
  }
}
