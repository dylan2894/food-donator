package com.fooddonator.restapi.controller;

import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.annotation.Nullable;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.fooddonator.restapi.model.Donation;
import com.fooddonator.restapi.repository.DonationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/donation")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
public class DonationController {

  DonationController() {}

  @Autowired
  private DonationRepository repository;

  @GetMapping("/readOne")
  public ResponseEntity<Donation> getDonation(@RequestParam String id) {
    System.out.println("[DONATION CONTROLLER] /donation/readOne");
    Donation donation = repository.getDonation(id);
    if(donation == null) {
      System.out.println("[DONATION CONTROLLER] Donation with id: " + id + " not found.");
      return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(donation, HttpStatus.OK);
  }

  @GetMapping("/readAll")
  public ResponseEntity<List<Donation>> getDonations() {
    System.out.println("[USER CONTROLLER] /user/readAll");
    List<Donation> donations = repository.getDonations();
    return new ResponseEntity<>(donations, null, HttpStatus.OK);
  }

}