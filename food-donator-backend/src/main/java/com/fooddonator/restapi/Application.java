package com.fooddonator.restapi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.stargate.grpc.StargateBearerToken;
import io.stargate.proto.QueryOuterClass;
import io.stargate.proto.StargateGrpc;

import java.util.concurrent.TimeUnit;

import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class Application {

  @Value("${astra.id}")
  private String ASTRA_DB_ID;
  @Value("${astra.region}")
  private String ASTRA_DB_REGION;
  @Value("${astra.token}")
  private String ASTRA_DB_TOKEN;
  @Value("${astra.keyspace}")
  private String ASTRA_KEYSPACE;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

  @GetMapping("/")
  public String hello() {
    return "hello world!";
  }

  @GetMapping("/test")
  public String test() {
    ManagedChannel channel = ManagedChannelBuilder
    .forAddress(this.ASTRA_DB_ID + "-" + this.ASTRA_DB_REGION + ".apps.astra.datastax.com", 443)
    .useTransportSecurity()
    .build();

    StargateGrpc.StargateBlockingStub blockingStub =
    StargateGrpc.newBlockingStub(channel)
      .withDeadlineAfter(10, TimeUnit.SECONDS)
      .withCallCredentials(new StargateBearerToken(this.ASTRA_DB_TOKEN));

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("SELECT release_version FROM system.local")
    .build()); 

    return "Query String: " + queryString;
  }
}