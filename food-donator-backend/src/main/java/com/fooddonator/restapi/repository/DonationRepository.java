package com.fooddonator.restapi.repository;

import java.util.ArrayList;
import java.util.Map;
import java.util.List;
import java.util.ResourceBundle;

import org.springframework.context.annotation.PropertySource;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fooddonator.restapi.constants.ApplicationPropertiesKeys;
import com.fooddonator.restapi.model.Donation;
import com.fooddonator.restapi.utils.*;

@PropertySource("classpath:application.properties")
@Repository
public class DonationRepository {

  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private final String ASTRA_ID = resource.getString(ApplicationPropertiesKeys.ASTRA_ID);
  private final String ASTRA_REGION = resource.getString(ApplicationPropertiesKeys.ASTRA_REGION);
  private final String ASTRA_TOKEN = resource.getString(ApplicationPropertiesKeys.ASTRA_TOKEN);
  private final String ASTRA_KEYSPACE = resource.getString(ApplicationPropertiesKeys.ASTRA_KEYSPACE);
  private String baseUrl;
  private RestTemplate restTemplate;

  DonationRepository() {
    this.baseUrl = "https://" + ASTRA_ID + "-" + ASTRA_REGION + ".apps.astra.datastax.com/api/rest/v2/keyspaces/" + ASTRA_KEYSPACE;

    this.restTemplate = new RestTemplate();
    this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());  
  }

  /**
   * Gets a {@link Donation} in the Donation table using AstraDB's REST API.
   * @param id a {@link Donation} ID as an index for querying
   * @return the {@link Donation} object which matches the provided ID parameter
   */
  public Donation getDonation(String id) {
    System.out.println("\n[DONATION REPO] getDonation\n");
    var uri =UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment("/donation/" + id)
      .build()
      .toUri();
    var request = RequestEntity.get(uri)
      .header("X-Cassandra-Token", ASTRA_TOKEN)
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
      return DonationMapper.MapDonationJsonToDonation(target);
    }
    return null;
  }

  /**
   * 
   * @return
   */
  public List<Donation> getDonations() {
    var uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
    .pathSegment("/donation/rows")
    .build()
    .toUri();
    var request = RequestEntity.get(uri)
      .header("X-Cassandra-Token", ASTRA_TOKEN)
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

    List<Donation> response = new ArrayList<>();
    for (Map map : many) {
      response.add(DonationMapper.MapDonationJsonToDonation(map));
    }

    return response;
  }

}