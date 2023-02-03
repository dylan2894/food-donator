package com.fooddonator.restapi.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ResourceBundle;
import java.util.UUID;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fooddonator.restapi.model.Donor;


@PropertySource("classpath:application.properties")
@Repository
public class DonorRepository {

  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private final String ASTRA_DB_ID = resource.getString("astra.id");
  private final String ASTRA_DB_REGION = resource.getString("astra.region");
  private final String ASTRA_DB_TOKEN = resource.getString("astra.token");
  private final String ASTRA_DB_KEYSPACE = resource.getString("astra.keyspace");
  private String baseUrl;
  private RestTemplate restTemplate;

  public DonorRepository() {
    this.baseUrl = "https://" + ASTRA_DB_ID + "-" + ASTRA_DB_REGION + ".apps.astra.datastax.com/api/rest/v2/keyspaces/" + ASTRA_DB_KEYSPACE;

    this.restTemplate = new RestTemplate();
    this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
  }

  public Map createDonor(Donor donor) {
    var uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/donor")
      .build()
      .toUri();

    donor.id = UUID.randomUUID().toString();
    HashMap map = new HashMap();
    map.put("id", donor.id);
    map.put("name", donor.name);
    map.put("phone_num", donor.phone_num);
    map.put("lat", donor.lat);
    map.put("lon", donor.lon);


    RequestEntity<Map> req = RequestEntity.post(uri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .body(map);

    ResponseEntity<Map> resp = restTemplate.exchange(req, Map.class);
    return (Map) resp.getBody().get("data");
  }

  public Map getDonor(String id) {
    var uri =UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/donor/" + id)
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

  public List<Map> getDonors() {
    var uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/donor/rows")
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
  
  public void updateDonor(Donor donor) {
    var updateUri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/donor/" + donor.id)
      .build()
      .toUri();

    HashMap map = new HashMap();
    map.put("name", donor.name);
    map.put("phone_num", donor.phone_num);
    map.put("lat", donor.lat);
    map.put("lon", donor.lon);

    RequestEntity<Map> updateRequest = RequestEntity.put(updateUri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .body(map);

    restTemplate.exchange(updateRequest, Map.class);
  }

  public void deleteDonor(String id) {
    var uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/donor/" + id)
      .build()
      .toUri();
    var deleteRequest = RequestEntity.delete(uri)
      .header("X-Cassandra-Token", ASTRA_DB_TOKEN)
      .build();

    restTemplate.exchange(deleteRequest, Map.class);
  }
}
