package com.fooddonator.restapi.repository;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ResourceBundle;
import java.util.UUID;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Repository;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.context.annotation.PropertySource;
import com.fooddonator.restapi.model.Donee;

@PropertySource("classpath:application.properties")
@Repository
public class DoneeRepository {
  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private final String ASTRA_DB_ID = resource.getString("astra.id");
  private final String ASTRA_DB_REGION = resource.getString("astra.region");
  private final String ASTRA_DB_TOKEN = resource.getString("astra.token");
  private final String ASTRA_DB_KEYSPACE = resource.getString("astra.keyspace");
  private String baseUrl;
  private RestTemplate restTemplate;

  public DoneeRepository() {
    this.baseUrl = "https://" + ASTRA_DB_ID + "-" + ASTRA_DB_REGION + ".apps.astra.datastax.com/api/rest/v2/keyspaces/" + ASTRA_DB_KEYSPACE;

    this.restTemplate = new RestTemplate();
    this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
  }

  /**
   * Creates a new {@link Donee} in the Donee table using AstraDB's REST API.
   * @param donee the new {@link Donee} to create in the DB
   * @return the result from the AstraDB REST API request
   */
  public Map createDonee(Donee donee) {
    var uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
    .pathSegment("/donee")
    .build()
    .toUri();

    donee.id = UUID.randomUUID().toString();
    HashMap map = new HashMap();
    map.put("id", donee.id);
    map.put("phone_num", donee.phone_num);


    RequestEntity<Map> req = RequestEntity.post(uri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .body(map);

    ResponseEntity<Map> resp = restTemplate.exchange(req, Map.class);
    return (Map) resp.getBody().get("data");
  }

  /**
   * Gets a {@link Donee} in the Donee table using AstraDB's REST API.
   * @param id a {@link Donee} ID as an index for querying
   * @return the {@link Donee} object which matches the provided ID parameter
   */
  public Map getDonee(String id) {
    var uri =UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/donee/" + id)
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
      return many.get(0);
    }
    return new HashMap<String, String>();
  }

    /**
   * Gets a {@link Donee} from the Donee table using AstraDB's REST API using the phone number as an index 
   * @param phone_num the phone number of the {@link Donee} to retrieve
   * @return the {@link Donee} object which matches the provided phone number parameter
   */
  //TODO fix this query string
  public Map getDoneeByPhoneNum(String phone_num) {
    String queryString = "/donee?where=%7B%22phone_num%22%3A%7B%22%24eq%22%3A%22"+ phone_num +"%22%7D%7D&fields=id";
    System.out.println("\nQueryString: "+queryString+"\n");
    var uri =UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment(queryString)
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
    if(many.size() == 0) {
      Map result = new HashMap<String, String>();
      result.put("error", "could not find donee by phone number.");
      return result;
    }
    return many.get(0);
  }

  /**
   * Gets all {@link Donee}s from the Donee table using AstraDB's REST API.
   * @return a list of all {@link Donee} objects
   */
  public List<Map> getDonees() {
    var uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/donee/rows")
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
   * Updates a {@link Donee} in the Donee table using AstraDB's REST API.
   * @param donee the updated {@link Donee} object
   * @return the result from the AstraDB REST API request
   */
  public void updateDonee(Donee donee) {
    var updateUri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/donee/" + donee.id)
      .build()
      .toUri();

    HashMap map = new HashMap();
    map.put("phone_num", donee.phone_num);

    RequestEntity<Map> updateRequest = RequestEntity.put(updateUri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .body(map);

    restTemplate.exchange(updateRequest, Map.class);
  }

  /**
   * Deletes a {@link Donee} from the Donee table using AstraDB's REST API.
   * @param id the {@link Donee} ID of the donee to be deleted
   * @return the result from the AstraDB REST API request
   */
  public void deleteDonee(String id) {
    var uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/donee/" + id)
      .build()
      .toUri();
    var deleteRequest = RequestEntity.delete(uri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .build();

    restTemplate.exchange(deleteRequest, Map.class);
  }
}