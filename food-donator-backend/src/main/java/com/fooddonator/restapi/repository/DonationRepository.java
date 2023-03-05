package com.fooddonator.restapi.repository;

import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ResourceBundle;
import java.util.UUID;

import org.springframework.context.annotation.PropertySource;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fooddonator.restapi.constants.ApplicationPropertiesKeys;
import com.fooddonator.restapi.model.Donation;
import com.fooddonator.restapi.utils.*;
import com.fooddonator.restapi.constants.RequestKeys;
import com.fooddonator.restapi.constants.RequestRouting;

@PropertySource("classpath:application.properties")
@Repository
public class DonationRepository {

  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private String baseUrl = resource.getString(ApplicationPropertiesKeys.ASTRA_URL);
  private String astraToken = resource.getString(ApplicationPropertiesKeys.ASTRA_TOKEN);
  private RestTemplate restTemplate;

  DonationRepository() {
    this.restTemplate = new RestTemplate();
    this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());  
  }

  /**
   * Creates a new {@link Donation} in the Donation table using AstraDB's REST API.
   * @param donation the new {@link Donation} to create in the DB
   * @return the result from the AstraDB REST API request
   */
  public Map createDonation(Donation donation) {
    donation.id = UUID.randomUUID().toString();

    System.out.println("New donation date: " + donation.donationdate);
    System.out.println("New donation start time: " + donation.starttime);
    System.out.println("New donation end time: " + donation.endtime);

    URI uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment(RequestRouting.Donation.Repository.CREATE_DONATION)
      .build()
      .toUri();

    RequestEntity<Donation> req = RequestEntity.post(uri)
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, astraToken)
      .body(donation);

    try {
      ResponseEntity<Map> resp = restTemplate.exchange(req, Map.class);
      if(resp.getBody() != null) {
        return resp.getBody();
      }
    } catch(RestClientException e) {
      System.out.println("[DONATION REPO] createDonation() error");
      System.out.println(e.getMessage());
    }

    return new HashMap<String, String>();
  }

  /**
   * Gets a {@link Donation} in the Donation table using AstraDB's REST API.
   * @param id a {@link Donation} ID as an index for querying
   * @return the {@link Donation} object which matches the provided ID parameter
   */
  public Donation getDonation(String id) {
    System.out.println("\n[DONATION REPO] getDonation\n");
    URI uri =UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment(RequestRouting.Donation.Repository.GET_DONATION + id)
      .build()
      .toUri();
    RequestEntity<Void> request = RequestEntity.get(uri)
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, astraToken)
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
   * Gets all {@link Donation}'s from the Donation table using AstraDB's REST API.
   * @return A {@link List} of {@link Donation} objects.
   */
  public List<Donation> getDonations() {
    System.out.println("\n[DONATION REPO] getDonation\n");
    URI uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
    .pathSegment(RequestRouting.Donation.Repository.GET_DONATIONS)
    .build()
    .toUri();
    RequestEntity<Void> request = RequestEntity.get(uri)
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, astraToken)
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

  /**
   * Gets all {@link Donation}'s from the Donation table matching the supplied user id using AstraDB's REST API.
   * @param userId A {@link String} UUID.  
   * @return A {@link List} of {@link Donation} objects.
   */
  public List<Donation> getDonationsByUserId(String userId) {
    System.out.println("\n[DONATION REPO] getDonationsByUserId\n");

    String search = "{\"userid\":{\"$eq\":\""+userId+"\"}}";
    var request = RequestEntity.get(baseUrl + RequestRouting.Donation.Repository.GET_DONATIONS_BY_USER_ID)
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, astraToken)
      .build();
      
    ResponseEntity<Map> rateResponse =
    restTemplate.exchange(
      baseUrl + RequestRouting.Donation.Repository.GET_DONATIONS_BY_USER_ID,
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
    List<Donation> response = new ArrayList<>();
    for (Map map : many) {
      response.add(DonationMapper.MapDonationJsonToDonation(map));
    }

    return response;
  }

  //TODO
  public Map deleteDonation(String donationId) {
    URI uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .pathSegment(RequestRouting.Donation.Repository.DELETE_DONATION)
      .build()
      .toUri();

    RequestEntity<Void> req = RequestEntity.delete(uri)
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, astraToken)
      .build();

    try {
      ResponseEntity<Map> resp = restTemplate.exchange(req, Map.class);
      if(resp.getBody() != null) {
        return resp.getBody();
      }
    } catch(RestClientException e) {
      System.out.println("[DONATION REPO] createDonation() error");
      System.out.println(e.getMessage());
    }

    return new HashMap<String, String>();
  }
}