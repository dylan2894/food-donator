package com.fooddonator.restapi.controller;

import java.util.List;
import java.util.Map;
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
  public Map createDonor(@RequestBody Donor donor) {
    System.out.println("[CONTROLLER] /donor/create");
    return repository.createDonor(donor);
  }
  
  @GetMapping("/readOne")
  public Map getDonor(@RequestParam String id) {
    System.out.println("[CONTROLLER] /donor/readOne");
    return repository.getDonor(id);
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
