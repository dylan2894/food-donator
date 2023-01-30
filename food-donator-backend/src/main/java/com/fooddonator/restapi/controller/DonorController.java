package com.fooddonator.restapi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fooddonator.restapi.model.Donor;
import com.fooddonator.restapi.repository.DonorRepository;

@RestController
@RequestMapping("/donor")
public class DonorController {

  DonorController() {}

  private DonorRepository repository = new DonorRepository();

  @PostMapping("/create")
  public String createDonor(@RequestBody Donor donor) {
    System.out.println("[CONTROLLER] /donor/create");
    return repository.createDonor(donor.name, donor.coords, donor.phone_num).toJSONString();
  }
  
  @GetMapping("/readOne")
  public Donor getDonor(@RequestParam String id) {
    System.out.println("[CONTROLLER] /donor/readOne");
    return repository.getDonor(id);
  }

  @GetMapping("/readAll")
  public List<Donor> getDonors() {
    System.out.println("[CONTROLLER] /donor/readAll");
    return repository.getDonors();
  }

  @PostMapping("/update")
  public String updateDonor(@RequestBody Donor donor) {
    System.out.println("[CONTROLLER] /donor/update");
    return repository.updateDonor(donor).toJSONString();
  }

  @GetMapping("/delete")
  public String deleteDonor(@RequestParam String id) {
    System.out.println("[CONTROLLER] /donor/delete");
    return repository.deleteDonor(id).toJSONString();
  }
  
}
