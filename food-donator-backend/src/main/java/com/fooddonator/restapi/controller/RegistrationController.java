package com.fooddonator.restapi.controller;

import java.util.Map;
import java.util.HashMap;

import com.fooddonator.restapi.constants.ResponseKeys;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.fooddonator.restapi.service.RegistrationService;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@RestController
@RequestMapping("/register")
@CrossOrigin(
  origins = {"https://food-donator-frontend.web.app/", "http://localhost:4200/"}, 
  allowedHeaders = "*",
  methods = {RequestMethod.POST}
)
public class RegistrationController {

  private Logger logger = LogManager.getLogger(RegistrationController.class);
  
  RegistrationController() {}

  @Autowired
  RegistrationService registrationService;
  @Autowired
  UserRepository userRepo;

  @PostMapping("/user")
  public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
    Map<String, String> msg = new HashMap<>();

    // check if user exists already
    User existingUser = userRepo.getUserByPhoneNum(user.phone_num);
    if(existingUser != null) {
      msg.put(ResponseKeys.ERROR, "this user already exists.");
      return new ResponseEntity<>(msg, HttpStatus.NOT_FOUND);
    }

    // try register the new user
    try {
      registrationService.registerUser(user);
      logger.info("registerUser completed.");
    } catch (Exception e) {
      msg.put(ResponseKeys.ERROR, e.getMessage());
      return new ResponseEntity<>(msg, HttpStatus.BAD_REQUEST);
    }

    msg.put(ResponseKeys.STATUS, "successfully registered user.");
    return new ResponseEntity<>(msg, HttpStatus.OK);
  }
}
