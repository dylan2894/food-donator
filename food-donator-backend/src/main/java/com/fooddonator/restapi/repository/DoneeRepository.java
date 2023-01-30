package com.fooddonator.restapi.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.stargate.grpc.StargateBearerToken;
import io.stargate.proto.QueryOuterClass;
import io.stargate.proto.QueryOuterClass.ResultSet;
import io.stargate.proto.QueryOuterClass.Row;
import io.stargate.proto.StargateGrpc;

import org.json.simple.JSONObject;
import org.springframework.context.annotation.PropertySource;

import com.fooddonator.restapi.model.Donee;

@PropertySource("classpath:src/main/resources/application.properties")
public class DoneeRepository {
  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private final String ASTRA_DB_ID = resource.getString("astra.id");
  private final String ASTRA_DB_REGION = resource.getString("astra.region");
  private final String ASTRA_DB_TOKEN = resource.getString("astra.token");
 
  private StargateGrpc.StargateBlockingStub blockingStub;

  private void config() {
    ManagedChannel channel = ManagedChannelBuilder
    .forAddress(ASTRA_DB_ID + "-" + ASTRA_DB_REGION + ".apps.astra.datastax.com", 443)
    .useTransportSecurity()
    .build();

    this.blockingStub =
    StargateGrpc.newBlockingStub(channel)
      .withDeadlineAfter(10, TimeUnit.SECONDS)
      .withCallCredentials(new StargateBearerToken(ASTRA_DB_TOKEN));
  }

  public JSONObject createDonee(Donee donee) {
    this.config();

    if(donee.phone_num.equals("")) {
      JSONObject resp = new JSONObject();
      resp.put("error", "Provide phone_num");
      return resp;
    }

    UUID id = UUID.randomUUID();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("INSERT INTO main_keyspace.donee (id, phone_num) VALUES ('"+id+"', '"+donee.phone_num+"') IF NOT EXISTS;")
    .build()); 

    ResultSet rs = queryString.getResultSet();
    JSONObject response = new JSONObject();
    for (Row row : rs.getRowsList()) {
      response.putAll(row.getAllFields());
    }

    return response;
  }

  //TODO
  public Donee getDonee(String id) {
    this.config();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("SELECT * FROM main_keyspace.donee WHERE id=\'"+id+"\';")
    .build()); 

    ResultSet rs = queryString.getResultSet();
    Row row = rs.getRows(0);

    //TODO fix this index
    String phone_num = row.getValues(2).getString();

    return new Donee(id, phone_num);
  }

  //TODO
  public List<Donee> getDonees() {
    this.config();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("SELECT * FROM main_keyspace.donee;")
    .build());

    ResultSet rs = queryString.getResultSet();
    List<Row> list = rs.getRowsList();

    List<Donee> response = new ArrayList<Donee>();
    for (Row row : list) {
      //TODO get correct index
      String id = row.getValues(0).getString();
      //TODO get correct index
      String phone_num = row.getValues(3).getString();

      Donee donee = new Donee(id, phone_num);
      response.add(donee);
    }

    return response;
  }

  public JSONObject updateDonee(Donee donee) {
    this.config();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("UPDATE main_keyspace.donee SET phone_num='"+donee.phone_num+"' WHERE id='"+donee.id+"';")
    .build()); 

    ResultSet rs = queryString.getResultSet();
    JSONObject response = new JSONObject();
    for (Row row : rs.getRowsList()) {
      response.putAll(row.getAllFields());
    }

    return response;
  }

  public JSONObject deleteDonee(String id) {
    this.config();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("DELETE FROM main_keyspace.donee WHERE id='"+id+"' IF EXISTS;")
    .build());

    ResultSet rs = queryString.getResultSet();
    JSONObject response = new JSONObject();
    for (Row row : rs.getRowsList()) {
      response.putAll(row.getAllFields());
    }

    return response;
  }
}