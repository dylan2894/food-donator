package com.fooddonator.restapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddonator.restapi.repository.TagRepository;
import com.fooddonator.restapi.model.Tag;

@RestController
@RequestMapping("/tags")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TagController {
  
  TagController(){}

  @Autowired
  private TagRepository repository;

  @GetMapping("/readAll")
  public List<Tag> getTags() {
    System.out.println("[TAG CONTROLLER] /tags/readAll");
    return repository.getTags();
  }
}
