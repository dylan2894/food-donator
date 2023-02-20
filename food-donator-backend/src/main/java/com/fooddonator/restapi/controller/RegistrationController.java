package com.fooddonator.restapi.controller;

import java.util.Map;
import java.util.HashMap;

import com.fooddonator.restapi.model.Donor;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.repository.UserRepository;
import com.fooddonator.restapi.model.Donee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.fooddonator.restapi.service.RegistrationService;

@RestController
@RequestMapping("/register")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
public class RegistrationController {
  
  RegistrationController() {}

  @Autowired
  RegistrationService registrationService;
  @Autowired
  UserRepository userRepo;

  @PostMapping("/user")
  public ResponseEntity<Map> registerUser(@RequestBody User user) {
    Map<String, String> msg = new HashMap<>();

    // check if user exists already
    User existingUser = userRepo.getUser(user.id);
    if(existingUser != null) {
      msg.put("error", "this user already exists.");
      return new ResponseEntity<>(msg, HttpStatus.NOT_FOUND);
    }

    // try register the new user
    try {
      registrationService.registerUser(user);
      System.out.println("[REGISTRATION CONTROLLER] registerUser() completed.");
    } catch (Exception e) {
      msg.put("error", e.getMessage());
      return new ResponseEntity<>(msg, HttpStatus.BAD_REQUEST);
    }

    msg.put("status", "successfully registered user.");
    return new ResponseEntity<>(msg, HttpStatus.OK);
  }

  // @PostMapping("/donor")
  // public ResponseEntity<Map> registerDonor(@RequestBody Donor donor) {
  //   registrationService.registerDonor(donor);
  //   System.out.println("[REGISTRATION CONTROLLER] registerDonor()");
  //   return new ResponseEntity<>(new HashMap(), HttpStatus.OK);
  // }

  // @PostMapping("/donee")
  // public ResponseEntity<Map> registerDonee(@RequestBody Donee donee) {
  //   registrationService.registerDonee(donee);
  //   System.out.println("[REGISTRATION CONTROLLER] registerDonee()");
  //   return new ResponseEntity<>(new HashMap(), HttpStatus.OK);
  // }
}
