package com.fooddonator.restapi.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.fooddonator.restapi.constants.ResponseKeys;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.repository.UserRepository;
import com.fooddonator.restapi.utils.PhoneNumUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

  UserController() {}

  @Autowired
  private UserRepository repository;
  private PhoneNumUtil phoneNumUtil;

  //@PostMapping("/create")
  // public Map createUser(@RequestBody User user) {
  //   System.out.println("[CONTROLLER] /user/create");
  //   return repository.createUser(user);
  // }
  
  @GetMapping("/readOne")
  public ResponseEntity<User> getUser(@RequestParam String id) {
    System.out.println("[USER CONTROLLER] /user/readOne");
    User user = repository.getUser(id);
    if(user == null) {
      System.out.println("[USER CONTROLLER] User with id: " + id + " not found.");
      return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
    }
    user.salt = null;
    user.password = null;
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping("/readOneByPhoneNum")
  public ResponseEntity<User> getUserByPhoneNum(@RequestParam String phoneNum) {
    System.out.println("[USER CONTROLLER] /user/readOneByPhoneNum");

    User user = repository.getUserByPhoneNum(phoneNum);

    if(user == null) {
      HashMap<String, String> body = new HashMap<>();
      System.out.println("[USER CONTROLLER] User with phone number: " + phoneNum + " not found.");
      return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
    }

    user.salt = null;
    user.password = null;
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping("/readAll")
  public List<User> getUsers() {
    System.out.println("[USER CONTROLLER] /user/readAll");
    List<User> users = repository.getUsers();
    users.forEach(user -> {
      user.password = null;
      user.salt = null;
    });
    return users;
  }

  @GetMapping("/readDonors")
  public List<User> getDonors() {
    System.out.println("[USER CONTROLLER] /user/readDonors");
    List<User> donors = repository.getDonors();
    donors.forEach(donor -> {
      donor.password = null;
      donor.salt = null;
    });
    return donors;
  }
  
  @PostMapping("/update")
  public ResponseEntity<Map> updateUser(@RequestBody Map user) {
    Map<String, Boolean> msg = new HashMap<>();

    System.out.println("[USER CONTROLLER] /user/update");

    try {
      ResponseEntity<Map> response = repository.updateUser(user);
      if(response != null) {
        return response;
      }
    } catch(Exception e) {
      System.out.println(e);
    }

    System.out.println("[USER CONTROLLER] Could not update user with id: " + user.get("id"));
    return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
  }

  @GetMapping("/delete")
  public ResponseEntity<Map> deleteUser(@RequestParam String id) {
    Map<String, String> msg = new HashMap<>();

    System.out.println("[USER CONTROLLER] /user/delete");
    try {
      repository.deleteUser(id);
    } catch (Exception e) {
      System.out.println(e);
      
      msg.put(ResponseKeys.ERROR, "could not delete user with id: " + id);
      return new ResponseEntity<>(msg, HttpStatus.OK);
    }
    
    msg.put(ResponseKeys.STATUS, "successfully deleted user with id: " + id);
    return new ResponseEntity<>(msg, HttpStatus.OK);
  }
  
}
