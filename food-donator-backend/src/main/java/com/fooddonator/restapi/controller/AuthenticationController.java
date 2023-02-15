package com.fooddonator.restapi.controller;

import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

  /**
   * Authenticates the given phone number and password. Returns a JWT if successful, otherwise an empty string.
   * @param body a JSON post http request body with 'phone_num' and 'password' as keys
   * @return A map containing a 'token' key and a JWT token if successful. Else, an empty string.
   */
  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> authenticate(@RequestBody Map<String, String> body) {
    return new ResponseEntity<>(new HashMap(), HttpStatus.OK);

    //TODO remove this temporary stub above
    // String phone_num = body.get("phone_num");
    // String password = body.get("password");

    // String jwt = this.authenticationService.login(phone_num, password);
    // Map<String, String> result = new HashMap<>();
    // result.put("token", jwt);

    // if(jwt.equals("")) {
    //   return new ResponseEntity<>(result, HttpStatus.UNAUTHORIZED);
    // }

    // return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping("/validateJwt")
  public ResponseEntity<Map<String, Boolean>> validateJwt(@RequestBody Map<String, String> body) {
    Map<String, Boolean> resp = new HashMap();
    resp.put("status", true);
    return new ResponseEntity<>(resp, HttpStatus.OK);

    //TODO remove this temporary stub above
    // String jwt = body.get("jwt");
    
    // Map<String, Boolean> result = new HashMap<>();
    // if(Boolean.TRUE.equals(this.authenticationService.isJwtValid(jwt))) {
    //   result.put("status", true);
    //   return new ResponseEntity<>(result, HttpStatus.OK);
    // }

    // result.put("status", false);
    // return new ResponseEntity<>(result, HttpStatus.OK);
  }
}
