package com.fooddonator.restapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages={
"com.fooddonator.restapi", 
"com.fooddonator.restapi.controller",
"com.fooddonator.restapi.model",
"com.fooddonator.restapi.repository",
"com.fooddonator.restapi.service"})
public class Application {  
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}