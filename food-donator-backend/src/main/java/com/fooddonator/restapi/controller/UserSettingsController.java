package com.fooddonator.restapi.controller;

import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddonator.restapi.model.UserSettings;
import com.fooddonator.restapi.repository.UserSettingsRepository;
import com.fooddonator.restapi.utils.JwtTokenUtil;

import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/user-settings")
@CrossOrigin(
  origins = {"https://food-donator-frontend.web.app/", "http://localhost:4200/"}, 
  allowedHeaders = "*",
  methods = {RequestMethod.POST, RequestMethod.GET}
)
public class UserSettingsController {
  
  private Logger logger = LogManager.getLogger(UserSettingsController.class);

  UserSettingsController() {}

  @Autowired
  private UserSettingsRepository userSettingsRepo;
  @Autowired
  private JwtTokenUtil jwtTokenUtil;

  @PostMapping("/getUserSettingsByJWT")
  public ResponseEntity<UserSettings> getUserSettingsByJWT(@RequestBody String jwt) {
    logger.info("/user-settings/getUserSettingsByJWT");
    String phoneNum = this.jwtTokenUtil.getPhoneNumFromToken(jwt);
    if(phoneNum == null) {
      return null;
    }

    try {
      UserSettings userSettings = this.userSettingsRepo.getUserSettingsByPhoneNum(phoneNum);
      if(userSettings == null) {
        logger.warn("User settings with jwt: {} not found.", jwt);
        return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
      }
      return new ResponseEntity<>(userSettings, HttpStatus.OK);
    } catch(Exception e) {
      return new ResponseEntity<>(null, null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/update")
  public ResponseEntity<Map> updateUserSettings(@RequestBody Map userSettings) {
    logger.info("/user-settings/update");

    try {
      ResponseEntity<Map> response = userSettingsRepo.updateUserSettings(userSettings);
      if(response != null) {
        return response;
      }
    } catch(Exception e) {
      logger.error("Cannot update user", e);
    }

    logger.error("Could not update user with id: {}", userSettings.get("id"));
    return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
  }
}

