package com.fooddonator.restapi.repository;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.UUID;

import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fooddonator.restapi.constants.RequestKeys;
import com.fooddonator.restapi.model.UserTag;

@PropertySource("classpath:application.properties")
@Repository
public class UserTagRepository {
  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private final String ASTRA_REST_API_URL = resource.getString("astra.url");
  private final String ASTRA_DB_TOKEN = resource.getString("astra.token");
  private RestTemplate restTemplate;

  UserTagRepository() {
    this.restTemplate = new RestTemplate();
    this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());  
  }

  /**
   * Creates a new {@link UserTag} in the usertags table using AstraDB's REST API.
   * @param user the new {@link UserTag} to create in the DB
   * @return the result from the AstraDB REST API request
   */
  public Map createUserTag(UserTag userTag) {
    URI uri = UriComponentsBuilder.fromHttpUrl(ASTRA_REST_API_URL)
      .pathSegment("/usertags")
      .build()
      .toUri();

    RequestEntity<UserTag> req = RequestEntity.post(uri)
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, ASTRA_DB_TOKEN)
      .body(userTag);

    ResponseEntity<Map> resp = restTemplate.exchange(req, Map.class);
    if(resp != null && resp.getBody() != null) {
      return (Map) resp.getBody().get("data");
    }
    return new HashMap();
  }

  /**
   * Gets a list of {@link UserTag}'s which match this donation ID, from the usertags table using AstraDB's REST API.
   * @param id a string {@link Donation} ID as an index for querying
   * @return the {@link UserTag}'s which matches the provided donation ID parameter
   */
  public List<UserTag> getUserTagsByDonationId(String donationId) {
    System.out.println("\n[USER TAG REPO] getUserTagsByDonationId\n");
    
    String search = "{\"donationid\":{\"$eq\":\""+donationId+"\"}}";
    var request = RequestEntity.get(ASTRA_REST_API_URL + "/usertags?where={search}")
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, ASTRA_DB_TOKEN)
      .build();
      
    ResponseEntity<Map> rateResponse =
    restTemplate.exchange(
      ASTRA_REST_API_URL + "/usertags?where={search}",
      HttpMethod.GET,
      request,
      Map.class,
      search
    );
    Map data = rateResponse.getBody();
    ArrayList<Map> many = (ArrayList<Map>) data.get("data");

    List<UserTag> userTags = new ArrayList<>();
    if(!many.isEmpty()) {
      for(int i=0; i<many.size(); i++) {
        Map target = many.get(i);
        String tagId = target.get("tagid").toString();
        userTags.add(new UserTag(tagId, donationId));
      }
      return userTags;
    }
    return new ArrayList<>();
  }
}
