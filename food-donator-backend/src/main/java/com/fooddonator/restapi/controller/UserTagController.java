package com.fooddonator.restapi.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddonator.restapi.model.UserTag;
import com.fooddonator.restapi.repository.UserTagRepository;

@RestController
@RequestMapping("/usertags")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserTagController {
  
  UserTagController() {}

  @Autowired
  private UserTagRepository repository;

  @PostMapping("/create")
  public ResponseEntity<Map> createDonation(@RequestBody UserTag userTag) {

    System.out.println("[USER TAG CONTROLLER] /tags/create");
    Map createUserTagResult;
    try{
      createUserTagResult = repository.createUserTag(userTag);
    } catch(Exception e) {
      System.out.println(e.getMessage());
      Map<String, String> response = new HashMap<>();
      response.put("error", "cannot create usertag.");
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    return new ResponseEntity<>(createUserTagResult, HttpStatus.OK);
  }
}
