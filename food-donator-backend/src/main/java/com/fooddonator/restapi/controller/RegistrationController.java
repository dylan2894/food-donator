package com.fooddonator.restapi.controller;

import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.fooddonator.restapi.service.RegistrationService;

@RestController
@RequestMapping("/register")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
public class RegistrationController {
  
  RegistrationController() {}

  @Autowired
  RegistrationService registrationService;

  @PostMapping("/donor")
  public ResponseEntity<Map> registerDonor() {
    return new ResponseEntity<>(new HashMap(), HttpStatus.OK);
  }

  @PostMapping("/donee")
  public ResponseEntity<Map> registerDonee() {
    return new ResponseEntity<>(new HashMap(), HttpStatus.OK);
  }
}
