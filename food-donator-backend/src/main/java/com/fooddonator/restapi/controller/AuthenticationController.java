package com.fooddonator.restapi.controller;

import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fooddonator.restapi.service.AuthenticationService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/authenticate")
public class AuthenticationController {
  
  AuthenticationController() {}

  @Autowired
  private AuthenticationService authenticationService;

  @PostMapping("/")
  public Map<String, String> authenticate(@RequestBody Map<String, String> body) {
    String phone_num = body.get("phone_num");
    String password = body.get("password");

    String jwt = this.authenticationService.login(phone_num, password);
    Map<String, String> result = new HashMap<>();
    result.put("token", jwt);
    return result;
  }

  @PostMapping("/validateJwt")
  public Map<String, Boolean> validateJwt(@RequestBody Map<String, String> body) {
    String jwt = body.get("jwt");
    
    Map<String, Boolean> result = new HashMap<>();
    if(this.authenticationService.isJwtValid(jwt)) {
      result.put("status", true);
      return result;
    }

    result.put("status", false);
    return result;
  }
}
