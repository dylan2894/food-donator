package com.fooddonator.restapi.repository;

import java.util.List;
import java.net.URI;
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
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fooddonator.restapi.constants.RequestKeys;
import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.utils.UserMapper;

@PropertySource("classpath:application.properties")
@Repository
public class UserRepository {

  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private final String ASTRA_REST_API_URL = resource.getString("astra.url");
  private final String ASTRA_DB_TOKEN = resource.getString("astra.token");
  private RestTemplate restTemplate;

  UserRepository() {
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

    URI uri = UriComponentsBuilder.fromHttpUrl(ASTRA_REST_API_URL)
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
    URI uri =UriComponentsBuilder.fromHttpUrl(ASTRA_REST_API_URL)
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
    var request = RequestEntity.get(ASTRA_REST_API_URL + "/user?where={search}")
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .build();
      
    ResponseEntity<Map> rateResponse =
    restTemplate.exchange(
      ASTRA_REST_API_URL + "/user?where={search}",
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
    Object lat = target.get("lat");
    Object lon = target.get("lon");
    if(lat != null && lon != null) {
      user.lat = ((Number) target.get("lat")).doubleValue();
      user.lon = ((Number) target.get("lon")).doubleValue();
    } 
    user.name = target.get("name").toString();
    user.type = target.get("type").toString();
    return user;
  }

  public List<User> getUsers() {
    URI uri = UriComponentsBuilder.fromHttpUrl(ASTRA_REST_API_URL)
    .pathSegment("/user/rows")
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
    if(many.size() <= 0) {
      return null;
    }

    List<User> response = new ArrayList<>();
    for (Map map : many) {
      response.add(UserMapper.MapUserJsonToUser(map));
    }

    return response;
  }

  public List<User> getDonors() {
    System.out.println("\n[USER REPO] getDonors\n");
    String search = "{\"type\":{\"$eq\":\"donor\"}}";
    var request = RequestEntity.get(ASTRA_REST_API_URL + "/user?where={search}")
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .build();
      
    ResponseEntity<Map> rateResponse =
    restTemplate.exchange(
      ASTRA_REST_API_URL + "/user?where={search}",
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

    List<User> response = new ArrayList<>();
    for (Map map : many) {
      response.add(UserMapper.MapUserJsonToUser(map));
    }

    return response;
  }

  public ResponseEntity<Map> updateUser(Map user) {
    System.out.println("\n[USER REPO] updateUser()\n");

    URI uri = UriComponentsBuilder.fromHttpUrl(ASTRA_REST_API_URL)
      .pathSegment("/user/" + user.get("id"))
      .build()
      .toUri();

    user.remove("id");
    user.remove("password");
    user.remove("salt");
    
    RequestEntity<Map> req = RequestEntity.put(uri)
    .header(RequestKeys.Header.X_CASSANDRA_TOKEN, ASTRA_DB_TOKEN)
    .body(user);

    try {
      return restTemplate.exchange(req, Map.class);
    } catch(RestClientException e) {
      System.out.println("[USER REPO] updateUser() error");
      System.out.println(e.getMessage());
    }

    return null;
  }

  /**
   * Deletes a {@link User} from the User table using AstraDB's REST API.
   * @param id the {@link User} ID of the user to be deleted
   * @return the result from the AstraDB REST API request
   */
  public void deleteUser(String id) {
    var uri = UriComponentsBuilder.fromHttpUrl(ASTRA_REST_API_URL)
      .pathSegment("/user/" + id)
      .build()
      .toUri();
    var deleteRequest = RequestEntity.delete(uri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .build();

    restTemplate.exchange(deleteRequest, Map.class);
  }
}
