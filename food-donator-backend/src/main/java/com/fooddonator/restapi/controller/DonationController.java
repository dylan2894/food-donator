package com.fooddonator.restapi.controller;

import java.time.LocalTime;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
@CrossOrigin(origins = "*", allowedHeaders = "*")
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

  @GetMapping("/readCurrentAndUpcomingByUserId")
  public ResponseEntity<List<Donation>> getCurrentAndUpcomingDonationsByUserId(@RequestParam String userId) {
    System.out.println("[DONATION CONTROLLER] /donation/readCurrentAndUpcomingByUserId");

    Calendar now = new GregorianCalendar(TimeZone.getTimeZone("GMT"));
    int year = now.get(Calendar.YEAR);
    int month = now.get(Calendar.MONTH);
    int day = now.get(Calendar.DAY_OF_MONTH);
    now.setTimeInMillis(0);
    now.set(year, month, day);
    now.setTimeInMillis(now.getTimeInMillis() - 7200000);

    List<Donation> donations = repository.getDonationsByUserId(userId);

    List<Donation> currentAndUpcomingDonations = null;
    if(donations != null) {
      // filter donations to obtain upcoming and current donations
      currentAndUpcomingDonations = donations
      .stream()
      .filter(donation -> donation.donationdate >= now.getTime().getTime())
      .collect(Collectors.toList());
    }
  
    return new ResponseEntity<>(currentAndUpcomingDonations, null, HttpStatus.OK);
  }

  @GetMapping("/readAllCurrentAndUpcoming")
  public ResponseEntity<List<Donation>> getCurrentAndUpcomingDonations() {
    System.out.println("[DONATION CONTROLLER] /donation/readAllCurrentAndUpcoming");

    Calendar now = new GregorianCalendar(TimeZone.getTimeZone("GMT"));
    int year = now.get(Calendar.YEAR);
    int month = now.get(Calendar.MONTH);
    int day = now.get(Calendar.DAY_OF_MONTH);
    now.setTimeInMillis(0);
    now.set(year, month, day);
    now.setTimeInMillis(now.getTimeInMillis() - 7200000);

    List<Donation> donations = repository.getDonations();

    List<Donation> currentAndUpcomingDonations = null;
    if(donations != null) {
      // filter donations to obtain upcoming and current donations
      currentAndUpcomingDonations = donations
      .stream()
      .filter(donation -> donation.donationdate >= now.getTime().getTime())
      .collect(Collectors.toList());
    }
  
    return new ResponseEntity<>(currentAndUpcomingDonations, null, HttpStatus.OK);
  }

  @GetMapping("/delete")
  public ResponseEntity<Map> deleteDonation(@RequestParam String id) {
    System.out.println("[DONATION CONTROLLER] /donation/delete");
    Map deleted = repository.deleteDonation(id);
    if(deleted.isEmpty()) {
      System.out.println("[DONATION CONTROLLER] Donation with id: " + id + " could not be deleted.");
      Map<String, String> response = new HashMap<>();
      response.put("error", "cannot delete donation.");
      return new ResponseEntity<>(response, null, HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity<>(deleted, null, HttpStatus.OK);
  }
}