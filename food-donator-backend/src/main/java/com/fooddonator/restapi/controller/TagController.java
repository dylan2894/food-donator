package com.fooddonator.restapi.controller;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fooddonator.restapi.repository.TagRepository;
import com.fooddonator.restapi.model.Tag;

@RestController
@RequestMapping("/tags")
@CrossOrigin(
  origins = "https://food-donator-frontend.web.app/", 
  allowedHeaders = "*",
  methods = {RequestMethod.GET}
)
public class TagController {

  private Logger logger = LogManager.getLogger(TagController.class);
  
  TagController(){}

  @Autowired
  private TagRepository repository;

  @GetMapping("/readAll")
  public List<Tag> getTags() {
    logger.info("/tags/readAll");
    return repository.getTags();
  }
}
