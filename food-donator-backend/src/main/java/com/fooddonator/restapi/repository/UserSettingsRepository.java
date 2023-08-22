package com.fooddonator.restapi.repository;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.UUID;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fooddonator.restapi.constants.RequestKeys;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.model.UserSettings;

@PropertySource("classpath:application.properties")
@Repository
public class UserSettingsRepository {
  private Logger logger = LogManager.getLogger(UserSettingsRepository.class);

  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private final String ASTRA_REST_API_URL = resource.getString("astra.url");
  private final String ASTRA_DB_TOKEN = resource.getString("astra.token");
  private RestTemplate restTemplate;

  UserSettingsRepository() {
    this.restTemplate = new RestTemplate();
    this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());  
  }

  /**
   * Creates a new {@link UserSettings} in the UserSettings table using AstraDB's REST API.
   * @param user the new {@link UserSettings} to create in the DB
   * @return the result from the AstraDB REST API request
   */
  public Map<String, Object> createUserSettings(UserSettings userSettings) {
    logger.info("Creating UserSettings for phone_num: {}", userSettings.phone_num);

    URI uri = UriComponentsBuilder.fromHttpUrl(ASTRA_REST_API_URL)
      .pathSegment("/usersettings")
      .build()
      .toUri();

    RequestEntity<UserSettings> req = RequestEntity.post(uri)
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, ASTRA_DB_TOKEN)
      .body(userSettings);

    ResponseEntity<Map> resp = restTemplate.exchange(req, Map.class);
    Map body = resp.getBody();
    if(body != null) {
      return (Map<String, Object>) body.get("data");
    }
    return new HashMap<>();
  }

  /**
   * Gets a {@link UserSettings} from the UserSettings table using AstraDB's REST API using the phone number as an index 
   * @param phone_num the phone number of the {@link UserSettings} to retrieve
   * @return the {@link UserSettings} object which matches the provided phone number parameter
   */
  public UserSettings getUserSettingsByPhoneNum(String phone_num) {
    logger.info("getUserSettingsByPhoneNum");
    String search = "{\"phone_num\":{\"$eq\":\""+phone_num+"\"}}";
    var request = RequestEntity.get(ASTRA_REST_API_URL + "/usersettings?where={search}")
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, ASTRA_DB_TOKEN)
      .build();
      
    ResponseEntity<Map> rateResponse =
    restTemplate.exchange(
      ASTRA_REST_API_URL + "/usersettings?where={search}",
      HttpMethod.GET,
      request,
      Map.class,
      search
    );
    Map data = rateResponse.getBody();
    ArrayList<Map> many = (ArrayList<Map>) data.get("data");
    if(many.isEmpty()) {
      return null;
    }

    Map target = many.get(0);
    UserSettings userSettings = new UserSettings();
    userSettings.phone_num = target.get("phone_num").toString();
    userSettings.poi = (Boolean) target.get("poi");
    userSettings.transit = (Boolean) target.get("transit");
    userSettings.administrative = (Boolean) target.get("administrative");
    userSettings.dark_map = (Boolean) target.get("dark_map");

    return userSettings;
  }

  /**
   * Updates a user's {@link UserSettings} from the UserSettings table using AstraDB's REST API using the phone number as an index 
   * @param userSettings a {@link Map} object which contains the user settings to update 
   */
  public ResponseEntity<Map> updateUserSettings(Map userSettings) {
    logger.info("updateUserSettings");

    URI uri = UriComponentsBuilder.fromHttpUrl(ASTRA_REST_API_URL)
      .pathSegment("/usersettings/" + userSettings.get("phone_num"))
      .build()
      .toUri();

    userSettings.remove("phone_num");
    
    RequestEntity<Map> req = RequestEntity.put(uri)
    .header(RequestKeys.Header.X_CASSANDRA_TOKEN, ASTRA_DB_TOKEN)
    .body(userSettings);

    try {
      return restTemplate.exchange(req, Map.class);
    } catch(RestClientException e) {
      logger.error("Cannot update user settings.", e);
    }

    return null;
  }
}
