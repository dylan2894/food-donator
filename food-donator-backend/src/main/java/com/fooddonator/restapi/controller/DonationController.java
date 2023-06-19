package com.fooddonator.restapi.controller;

import java.util.Calendar;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.fooddonator.restapi.model.Donation;
import com.fooddonator.restapi.repository.DonationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@RestController
@RequestMapping("/donation")
@CrossOrigin(
  origins = {"https://food-donator-frontend.web.app/", "http://localhost:4200/"}, 
  allowedHeaders = "*",
  methods = {RequestMethod.POST, RequestMethod.GET}
)
public class DonationController {

  private Logger logger = LogManager.getLogger(DonationController.class);

  DonationController() {}

  @Autowired
  private DonationRepository repository;

  @PostMapping("/create")
  public ResponseEntity<Map<String, Object>> createDonation(@RequestBody Donation donation) {
    logger.info("/donation/create");

    Map<String, Object> createDonationResult = repository.createDonation(donation);
    
    if(createDonationResult.isEmpty()) {
      Map<String, Object> response = new HashMap<>();
      response.put("error", "cannot create donation.");
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    return new ResponseEntity<>(createDonationResult, HttpStatus.OK);
  }

  @GetMapping("/readOne")
  public ResponseEntity<Donation> getDonation(@RequestParam String id) {
    logger.info("/donation/readOne");
    Donation donation = repository.getDonation(id);
    if(donation == null) {
      logger.warn("Donation with id: {} not found.", id);
      return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(donation, HttpStatus.OK);
  }

  @GetMapping("/readAll")
  public ResponseEntity<List<Donation>> getDonations() {
    logger.info("/donation/readAll");
    List<Donation> donations = repository.getDonations();
    Collections.sort(donations);
    return new ResponseEntity<>(donations, null, HttpStatus.OK);
  }

  @GetMapping("/readAllByUserId")
  public ResponseEntity<List<Donation>> getDonationsByUserId(@RequestParam String userId) {
    logger.info("/donation/readAllByUserId");
    List<Donation> donations = repository.getDonationsByUserId(userId);
    Collections.sort(donations);
    return new ResponseEntity<>(donations, null, HttpStatus.OK);
  }

  @GetMapping("/readAllCurrentAndUpcoming")
  public ResponseEntity<List<Donation>> getCurrentAndUpcomingDonations() {
    logger.info("/donation/readAllCurrentAndUpcoming");
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
  
    Collections.sort(currentAndUpcomingDonations);
    return new ResponseEntity<>(currentAndUpcomingDonations, null, HttpStatus.OK);
  }

  @GetMapping("/readCurrentAndUpcomingByUserId")
  public ResponseEntity<List<Donation>> getCurrentAndUpcomingDonationsByUserId(@RequestParam String userId) {
    logger.info("/donation/readCurrentAndUpcomingByUserId");
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
      .filter(donation -> donation.donationdate >= now.getTime().getTime()) // gets donations which are today and in the future
      //TODO also check if a donation is today, but in the past! (compare string times)
      //.filter(donation -> donation.endtime >= )
      .collect(Collectors.toList());
    }

    logger.info("Donations:");
    logger.info(donations);
    logger.info(currentAndUpcomingDonations);
  
    Collections.sort(currentAndUpcomingDonations);
    return new ResponseEntity<>(currentAndUpcomingDonations, null, HttpStatus.OK);
  }

  @GetMapping("/readAllCurrentAndUpcomingByNonReserved")
  public ResponseEntity<List<Donation>> getCurrentAndUpcomingDonationsByNonReserved() {
    logger.info("/donation/readAllCurrentAndUpcomingByNonReserved");
    
    List<Donation> donations = this.getCurrentAndUpcomingDonations().getBody();
    if (donations != null) {
      List<Donation> nonReservedDonations = donations
          .stream()
          .filter(donation -> !donation.getReserved())
          .collect(Collectors.toList());
      return new ResponseEntity<>(nonReservedDonations, null, HttpStatus.OK);
    }
    
    return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
  }

  @PostMapping("/update")
  public ResponseEntity<Map> updateDonation(@RequestBody Map donation) {
    logger.info("/donation/update");

    try {
      ResponseEntity<Map> response = repository.updateDonation(donation);
      if(response != null) {
        return response;
      }
    } catch(Exception e) {
      logger.error("Cannot update donation", e);
    }

    logger.error("Could not update donation with id: {}", donation.get("id"));
    return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
  }

  @GetMapping("/delete")
  public ResponseEntity<Map<String, Object>> deleteDonation(@RequestParam String id) {
    logger.info("/donation/delete");
    Map<String, Object> deleted;
    try {
      deleted = repository.deleteDonation(id);
    } catch(Exception e) {
      logger.error("Donation with id: {} could not be deleted.", id, e);
      Map<String, Object> response = new HashMap<>();
      response.put("error", "cannot delete donation: " + id);
      return new ResponseEntity<>(response, null, HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity<>(deleted, null, HttpStatus.OK);
  }
}