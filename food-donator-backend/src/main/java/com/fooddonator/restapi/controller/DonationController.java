package com.fooddonator.restapi.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  @PostMapping("/create")
  public ResponseEntity<Map> createDonation(@RequestBody Donation donation) {

    System.out.println("\nDonation Date: " + Long.toString(donation.donationdate) + "\n");

    System.out.println("[DONATION CONTROLLER] /donation/create");
    Map createDonationResult = repository.createDonation(donation);
    
    if(createDonationResult.isEmpty()) {
      Map<String, String> response = new HashMap<>();
      response.put("error", "cannot create donation.");
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    return new ResponseEntity<>(createDonationResult, HttpStatus.OK);
  }

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
    System.out.println("[DONATION CONTROLLER] /donation/readAll");
    List<Donation> donations = repository.getDonations();
    return new ResponseEntity<>(donations, null, HttpStatus.OK);
  }

  @GetMapping("/readAllByUserId")
  public ResponseEntity<List<Donation>> getDonationsByUserId(@RequestParam String userId) {
    System.out.println("[DONATION CONTROLLER] /donation/readAllByUserId");
    List<Donation> donations = repository.getDonationsByUserId(userId);
    return new ResponseEntity<>(donations, null, HttpStatus.OK);
  }

}