package com.fooddonator.restapi.repository;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
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

import com.fooddonator.restapi.model.User;

@PropertySource("classpath:application.properties")
@Repository
public class UserRepository {

  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private final String ASTRA_DB_ID = resource.getString("astra.id");
  private final String ASTRA_DB_REGION = resource.getString("astra.region");
  private final String ASTRA_DB_TOKEN = resource.getString("astra.token");
  private final String ASTRA_DB_KEYSPACE = resource.getString("astra.keyspace");
  private String baseUrl;
  private RestTemplate restTemplate;

  UserRepository() {
    this.baseUrl = "https://" + ASTRA_DB_ID + "-" + ASTRA_DB_REGION + ".apps.astra.datastax.com/api/rest/v2/keyspaces/" + ASTRA_DB_KEYSPACE;

    this.restTemplate = new RestTemplate();
    this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());  
  }


  /**
   * Creates a new {@link User} in the User table using AstraDB's REST API.
   * @param user the new {@link User} to create in the DB
   * @return the result from the AstraDB REST API request
   */
  public Map createUser(User user) {
    user.id = UUID.randomUUID().toString();

    var uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/user")
      .build()
      .toUri();

    RequestEntity<User> req = RequestEntity.post(uri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .body(user);

    ResponseEntity<Map> resp = restTemplate.exchange(req, Map.class);
    if(resp != null && resp.getBody() != null) {
      return (Map) resp.getBody().get("data");
    }
    return new HashMap();
  }


  /**
   * Gets a {@link User} in the User table using AstraDB's REST API.
   * @param id a {@link User} ID as an index for querying
   * @return the {@link User} object which matches the provided ID parameter
   */
  public User getUser(String id) {
    System.out.println("\n[USER REPO] getUser\n");
    var uri =UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/user/" + id)
      .build()
      .toUri();
    var request = RequestEntity.get(uri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .build();
      
    ResponseEntity<Map> rateResponse =
    restTemplate.exchange(
      request,
      Map.class
    );
    Map data = rateResponse.getBody();
    ArrayList<Map> many = (ArrayList<Map>) data.get("data");
    if(many.size() > 0) {
      Map target = many.get(0);
      User user = new User();
      user.id = target.get("id").toString();
      user.password = target.get("password").toString();
      user.phone_num = target.get("phone_num").toString();
      user.salt = target.get("salt").toString();
      user.lat = ((Number) target.get("lat")).doubleValue();
      user.lon = ((Number) target.get("lon")).doubleValue();
      user.name = target.get("name").toString();
      user.type = target.get("type").toString();
      return user;
    }
    return null;
  }

  /**
   * Gets a {@link User} from the User table using AstraDB's REST API using the phone number as an index 
   * @param phone_num the phone number of the {@link User} to retrieve
   * @return the {@link User} object which matches the provided phone number parameter
   */
  public User getUserByPhoneNum(String phone_num) {
    System.out.println("\n[USER REPO] getUserByPhoneNum\n");
    String search = "{\"phone_num\":{\"$eq\":\""+phone_num+"\"}}";
    var request = RequestEntity.get(baseUrl + "/user?where={search}")
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .build();
      
    ResponseEntity<Map> rateResponse =
    restTemplate.exchange(
      baseUrl + "/user?where={search}",
      HttpMethod.GET,
      request,
      Map.class,
      search
    );
    Map data = rateResponse.getBody();
    ArrayList<Map> many = (ArrayList<Map>) data.get("data");
    if(many.size() <= 0) {
      return null;
    }

    Map target = many.get(0);
    User user = new User();
    user.id = target.get("id").toString();
    user.password =target.get("password").toString();
    user.phone_num = target.get("phone_num").toString();
    user.salt = target.get("salt").toString();
    user.lat = ((Number) target.get("lat")).doubleValue();
    user.lon = ((Number) target.get("lon")).doubleValue();
    user.name = target.get("name").toString();
    user.type = target.get("type").toString();
    return user;
  }

  public List<Map> getUsers() {
    var uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
    .pathSegment("/user/rows")
    .build()
    .toUri();
    var request = RequestEntity.get(uri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .build();
    
    ResponseEntity<Map> response =
    restTemplate.exchange(
      request,
      Map.class
    );
    Map data = response.getBody();
    return (ArrayList<Map>) data.get("data");
  }

  /**
   * Deletes a {@link User} from the User table using AstraDB's REST API.
   * @param id the {@link User} ID of the user to be deleted
   * @return the result from the AstraDB REST API request
   */
  public void deleteUser(String id) {
    var uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/user/" + id)
      .build()
      .toUri();
    var deleteRequest = RequestEntity.delete(uri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .build();

    restTemplate.exchange(deleteRequest, Map.class);
  }
}
