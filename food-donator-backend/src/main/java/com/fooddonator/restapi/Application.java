package com.fooddonator.restapi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages={
"com.fooddonator.restapi", 
"com.fooddonator.restapi.controller",
"com.fooddonator.restapi.model",
"com.fooddonator.restapi.repository",
"com.fooddonator.restapi.service"})
public class Application {

  @Value("${astra.id}")
  public String ASTRA_DB_ID;
  @Value("${astra.region}")
  public String ASTRA_DB_REGION;
  @Value("${astra.token}")
  public String ASTRA_DB_TOKEN;
  @Value("${astra.keyspace}")
  public String ASTRA_KEYSPACE;
  
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}