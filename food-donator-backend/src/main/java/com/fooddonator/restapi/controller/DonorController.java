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

import com.fooddonator.restapi.model.Donor;
import com.fooddonator.restapi.repository.DonorRepository;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/donor")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
public class DonorController {

  DonorController() {}

  @Autowired
  private DonorRepository repository;

  @PostMapping("/create")
  public Map createDonor(@RequestBody Donor donor) {
    System.out.println("[CONTROLLER] /donor/create");
    return repository.createDonor(donor);
  }
  
  @GetMapping("/readOne")
  @CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
  public ResponseEntity<Map> getDonor(@RequestParam String id) {
    System.out.println("[CONTROLLER] /donor/readOne");
    //HttpHeaders responseHeaders = new HttpHeaders();
    //responseHeaders.setLocation(location);
    //responseHeaders.set("MyResponseHeader", "MyValue");
    Map donor = repository.getDonor(id);
    if(!donor.containsKey("id")) {
      HashMap<String, String> body = new HashMap<>();
      body.put("error", "Donor with id: " + id + " not found");
      return new ResponseEntity<Map>(body, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<Map>(donor, HttpStatus.OK);
  }

  @GetMapping("/readAll")
  public List<Map> getDonors() {
    System.out.println("[CONTROLLER] /donor/readAll");
    return repository.getDonors();
  }

  @PostMapping("/update")
  public void updateDonor(@RequestBody Donor donor) {
    System.out.println("[CONTROLLER] /donor/update");
    repository.updateDonor(donor);
  }

  @GetMapping("/delete")
  public void deleteDonor(@RequestParam String id) {
    System.out.println("[CONTROLLER] /donor/delete");
    repository.deleteDonor(id);
  }
  
}
