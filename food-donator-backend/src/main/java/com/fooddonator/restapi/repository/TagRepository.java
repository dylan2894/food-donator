package com.fooddonator.restapi.repository;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fooddonator.restapi.constants.RequestKeys;
import com.fooddonator.restapi.model.Tag;
import com.fooddonator.restapi.utils.TagMapper;

@PropertySource("classpath:application.properties")
@Repository
public class TagRepository {

  private Logger logger = LogManager.getLogger(TagRepository.class);

  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private final String ASTRA_REST_API_URL = resource.getString("astra.url");
  private final String ASTRA_DB_TOKEN = resource.getString("astra.token");
  private RestTemplate restTemplate;

  TagRepository() {
    this.restTemplate = new RestTemplate();
    this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());  
  }

  /**
   * Gets all the tags from the 'tags' database table using AstraDB's REST API.
   * @return a {@link List} of {@link Tag}'s
   */
  public List<Tag> getTags() {
    URI uri = UriComponentsBuilder.fromHttpUrl(ASTRA_REST_API_URL)
    .pathSegment("/tags/rows")
    .build()
    .toUri();
    var request = RequestEntity.get(uri)
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, ASTRA_DB_TOKEN)
      .build();
    
    ResponseEntity<Map> rateResponse =
    restTemplate.exchange(
      request,
      Map.class
    );
    Map data = rateResponse.getBody();
    ArrayList<Map> many = (ArrayList<Map>) data.get("data");
    if(many.isEmpty()) {
      return null;
    }

    List<Tag> response = new ArrayList<>();
    for (Map map : many) {
      response.add(TagMapper.mapTagJsonToTag(map));
    }

    return response;
  }

  /**
   * Gets a {@link Tag} from the tags table using AstraDB's REST API.
   * @param id a string {@link Tag} ID as an index for querying.
   * @return the {@link Tag} object which matches the provided ID.
   */
  public Tag getTagById(String id) {
    logger.info("getTagById");
    URI uri =UriComponentsBuilder.fromHttpUrl(ASTRA_REST_API_URL)
      .pathSegment("/tags/" + id)
      .build()
      .toUri();
    var request = RequestEntity.get(uri)
      .header(RequestKeys.Header.X_CASSANDRA_TOKEN, ASTRA_DB_TOKEN)
      .build();
      
    ResponseEntity<Map> rateResponse =
    restTemplate.exchange(
      request,
      Map.class
    );
    Map data = rateResponse.getBody();
    ArrayList<Map> many = (ArrayList<Map>) data.get("data");
    if(!many.isEmpty()) {
      Map target = many.get(0);
      String tagName = target.get("name").toString();

      return new Tag(id, tagName);
    }
    return null;
  }
}
