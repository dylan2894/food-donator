package com.fooddonator.restapi.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.fooddonator.restapi.constants.ResponseKeys;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/user")
@CrossOrigin(
  origins = {"https://food-donator-frontend.web.app/", "http://localhost:4200/"}, 
  allowedHeaders = "*",
  methods = {RequestMethod.POST, RequestMethod.GET}
)
public class UserController {

  private Logger logger = LogManager.getLogger(UserController.class);

  UserController() {}

  @Autowired
  private UserRepository repository;
  
  @GetMapping("/readOne")
  public ResponseEntity<User> getUser(@RequestParam String id) {
    logger.info("/user/readOne");
    User user = repository.getUser(id);
    if(user == null) {
      logger.warn("User with id: {} not found.", id);
      return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
    }
    user.salt = null;
    user.password = null;
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping("/readOneByPhoneNum")
  public ResponseEntity<User> getUserByPhoneNum(@RequestParam String phoneNum) {
    logger.info("/user/readOneByPhoneNum");

    User user = repository.getUserByPhoneNum(phoneNum);

    if(user == null) {
      logger.warn("User with phone number: {} not found.", phoneNum);
      return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
    }

    user.salt = null;
    user.password = null;
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping("/readAll")
  public List<User> getUsers() {
    logger.info("/user/readAll");
    List<User> users = repository.getUsers();
    users.forEach(user -> {
      user.password = null;
      user.salt = null;
    });
    return users;
  }

  @GetMapping("/readDonors")
  public List<User> getDonors() {
    logger.info("/user/readDonors");
    List<User> donors = repository.getDonors();
    donors.forEach(donor -> {
      donor.password = null;
      donor.salt = null;
    });
    return donors;
  }
  
  @PostMapping("/update")
  public ResponseEntity<Map> updateUser(@RequestBody Map user) {
    logger.info("/user/update");

    try {
      ResponseEntity<Map> response = repository.updateUser(user);
      if(response != null) {
        return response;
      }
    } catch(Exception e) {
      logger.error("Cannot update user", e);
    }

    logger.error("Could not update user with id: {}", user.get("id"));
    return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
  }

  @GetMapping("/delete")
  public ResponseEntity<Map<String, String>> deleteUser(@RequestParam String id) {
    Map<String, String> msg = new HashMap<>();

    logger.info("/user/delete");
    try {
      repository.deleteUser(id);
    } catch (Exception e) {
      logger.error(e);
      
      msg.put(ResponseKeys.ERROR, "could not delete user with id: " + id);
      return new ResponseEntity<>(msg, HttpStatus.OK);
    }
    
    logger.info("Successfully deleted user with id: {}", id);
    msg.put(ResponseKeys.STATUS, "successfully deleted user with id: " + id);
    return new ResponseEntity<>(msg, HttpStatus.OK);
  }
  
}
