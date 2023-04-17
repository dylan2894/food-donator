package com.fooddonator.restapi.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fooddonator.restapi.model.Tag;
import com.fooddonator.restapi.model.UserTag;
import com.fooddonator.restapi.repository.TagRepository;
import com.fooddonator.restapi.repository.UserTagRepository;

@RestController
@RequestMapping("/usertags")
@CrossOrigin(
  origins = "https://food-donator-frontend.web.app/", 
  allowedHeaders = "*",
  methods = {RequestMethod.POST, RequestMethod.GET}
)
public class UserTagController {

  private Logger logger = LogManager.getLogger();

  UserTagController() {}

  @Autowired
  private UserTagRepository userTagRepository;
  @Autowired
  private TagRepository tagRepository;

  @PostMapping("/create")
  public ResponseEntity<Map> createUserTag(@RequestBody UserTag userTag) {
    logger.info("/tags/create");
    Map createUserTagResult;
    try {
      createUserTagResult = userTagRepository.createUserTag(userTag);
    } catch (Exception e) {
      logger.error(e);
      Map<String, String> response = new HashMap<>();
      response.put("error", "cannot create usertag.");
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    return new ResponseEntity<>(createUserTagResult, HttpStatus.OK);
  }

  /**
   * First gets {@link UserTag}'s for this donation, then using each
   * {@link UserTag}, the relevant {@link Tag}'s are fetched and returned for this
   * donation ID.
   * 
   * @param donationId The Donation ID for which the {@link Tag}'s must be
   *                   returned.
   * @return A list of tags associated with this donation.
   */
  @GetMapping("/readTagsByDonationId")
  public ResponseEntity<List<Tag>> getTagsByDonationId(@RequestParam String donationId) {
    logger.info("/usertags/readTagsByDonationId");
    
    List<UserTag> usertags = userTagRepository.getUserTagsByDonationId(donationId);
    if (usertags == null) {
      logger.warn("Usertags for donation with id: {} not found.", donationId);
      return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
    }

    List<Tag> tagList = new ArrayList<>();
    for (UserTag userTag : usertags) {
      tagList.add(tagRepository.getTagById(userTag.getTagid()));
    }

    if (tagList.isEmpty()) {
      return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(tagList, HttpStatus.OK);
  }
}
