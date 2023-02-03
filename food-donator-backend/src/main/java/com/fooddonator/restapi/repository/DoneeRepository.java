package com.fooddonator.restapi.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ResourceBundle;
import java.util.UUID;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.context.annotation.PropertySource;
import com.fooddonator.restapi.model.Donee;

@PropertySource("classpath:src/main/resources/application.properties")
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
    return many.get(0);
  }

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