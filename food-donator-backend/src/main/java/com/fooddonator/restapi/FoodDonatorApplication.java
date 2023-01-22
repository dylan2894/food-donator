package com.fooddonator.restapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.oss.driver.api.core.cql.Row;
import java.nio.file.Paths;

@SpringBootApplication
@RestController
public class FoodDonatorApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodDonatorApplication.class, args);

    //TODO fetch environment variables
    String CassDbUsername = "", CassDbPassword = "";

    // Create the CqlSession object:
    try (CqlSession session = CqlSession.builder()
    .withCloudSecureConnectBundle(Paths.get("./secure-connect-spring-cassandra.zip"))
    .withAuthCredentials(CassDbUsername, CassDbPassword)
    .build()) {
      // Select the release_version from the system.local table:
      ResultSet rs = session.execute("select release_version from system.local");
      Row row = rs.one();
      //Print the results of the CQL query to the console:
      if (row != null) {
        System.out.println(row.getString("release_version"));
        return;
      }
      
      System.out.println("An error occurred.");
    }
   //System.exit(0);
	}

  @GetMapping("/hello")
  public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
    return String.format("Hello %s!", name);
  }

  @GetMapping("/")
  public String landing() {
    return "Welcome to the landing page of the API!";
  }

}
