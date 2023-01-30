package com.fooddonator.restapi.controller;

import java.util.List;

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

  private DoneeRepository repository = new DoneeRepository();

  @PostMapping("/create")
  public String createDonee(@RequestBody Donee donee) {
    System.out.println("[CONTROLLER /donee/create]");
    return repository.createDonee(donee).toJSONString();
  }

  @GetMapping("/readOne")
  public Donee getDonee(@RequestParam String id) {
    System.out.println("[CONTROLLER /donee/readOne]");
    return repository.getDonee(id);
  }

  @GetMapping("/readAll")
  public List<Donee> getDonees() {
    System.out.println("[CONTROLLER /donee/readAll]");
    return repository.getDonees();
  }

  @PostMapping("/update")
  public String updateDonee(@RequestBody Donee donee) {
    System.out.println("[CONTROLLER /donee/update]");
    return repository.updateDonee(donee).toJSONString();
  }

  @GetMapping("/delete")
  public String deleteDonee(@RequestParam String id) {
    System.out.println("[CONTROLLER /donee/delete]");
    return repository.deleteDonee(id).toJSONString();
  }
}
