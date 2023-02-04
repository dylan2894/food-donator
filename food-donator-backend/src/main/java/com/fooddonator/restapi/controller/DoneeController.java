package com.fooddonator.restapi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fooddonator.restapi.model.Donee;
import com.fooddonator.restapi.repository.DoneeRepository;

@RestController
@RequestMapping("/donee")
public class DoneeController {
  DoneeController() {}

  @Autowired
  private DoneeRepository repository;

  @PostMapping("/create")
  public Map createDonee(@RequestBody Donee donee) {
    System.out.println("[CONTROLLER] /donee/create");
    return repository.createDonee(donee);
  }

  @GetMapping("/readOne")
  public Map getDonee(@RequestParam String id) {
    System.out.println("[CONTROLLER] /donee/readOne");
    return repository.getDonee(id);
  }

  @GetMapping("/readAll")
  public List<Map> getDonees() {
    System.out.println("[CONTROLLER] /donee/readAll");
    return repository.getDonees();
  }

  @PostMapping("/update")
  public void updateDonee(@RequestBody Donee donee) {
    System.out.println("[CONTROLLER] /donee/update");
    repository.updateDonee(donee);
  }

  @GetMapping("/delete")
  public void deleteDonee(@RequestParam String id) {
    System.out.println("[CONTROLLER] /donee/delete");
    repository.deleteDonee(id);
  }
}
