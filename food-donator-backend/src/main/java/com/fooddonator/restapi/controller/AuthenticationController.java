package com.fooddonator.restapi.controller;

import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fooddonator.restapi.service.AuthenticationService;
import com.fooddonator.restapi.constants.RequestKeys;
import com.fooddonator.restapi.constants.ResponseKeys;
import com.fooddonator.restapi.model.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/authenticate")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthenticationController {
  
  AuthenticationController() {}

  @Autowired
  private AuthenticationService authenticationService;

  /**
   * Authenticates the given phone number and password. Returns a JWT if successful, otherwise an empty string.
   * @param body a JSON post http request body with 'phone_num' and 'password' as keys
   * @return A map containing a 'token' key and a JWT token if successful. Else, an 'error' key and an error message.
   */
  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> authenticate(@RequestBody User user) {
    if(user.phone_num == null || user.password == null) {
      System.out.println("[AUTH CONTROLLER] Phone number or password is empty.");
      Map<String, String> emptyResp = new HashMap<>();
      emptyResp.put("error", "Phone number or password is empty.");
      return new ResponseEntity<>(emptyResp, HttpStatus.UNAUTHORIZED);
    }

    String jwt = this.authenticationService.login(user.phone_num, user.password);

    if(jwt == null) {
      Map<String, String> resp = new HashMap<>();
      resp.put(ResponseKeys.ERROR, "Invalid JWT");
      return new ResponseEntity<>(resp, HttpStatus.UNAUTHORIZED);
    }

    Map<String, String> result = new HashMap<>();
    result.put("token", jwt);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping("/validateJwtForDonor")
  public ResponseEntity<Map<String, Boolean>> validateJwtForDonor(@RequestBody Map<String, String> body) {    
    String jwt = body.get(RequestKeys.JWT);
    
    Map<String, Boolean> result = new HashMap<>();
    if(Boolean.TRUE.equals(this.authenticationService.isJwtValidForDonor(jwt))) {
      result.put(ResponseKeys.STATUS, true);
      return new ResponseEntity<>(result, HttpStatus.OK);
    }

    result.put(ResponseKeys.STATUS, false);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping("/validateJwtForDonee")
  public ResponseEntity<Map<String, Boolean>> validateJwtForDonee(@RequestBody Map<String, String> body) {    
    String jwt = body.get(RequestKeys.JWT);
    
    Map<String, Boolean> result = new HashMap<>();
    if(Boolean.TRUE.equals(this.authenticationService.isJwtValidForDonee(jwt))) {
      result.put(ResponseKeys.STATUS, true);
      return new ResponseEntity<>(result, HttpStatus.OK);
    }

    result.put(ResponseKeys.STATUS, false);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping("/getUserByJWT")
  public ResponseEntity<User> getUserByJWT(@RequestBody String jwt) {
    System.out.println("[AUTHENTICATION CONTROLLER] /authenticate/getUserByJWT");
    User user = this.authenticationService.getUserByJWT(jwt);
    if(user == null) {
      System.out.println("[AUTHENTICATION CONTROLLER] User with jwt: " + jwt + " not found.");
      return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
    }
    user.salt = null;
    user.password = null;
    return new ResponseEntity<>(user, HttpStatus.OK);
  }
}
