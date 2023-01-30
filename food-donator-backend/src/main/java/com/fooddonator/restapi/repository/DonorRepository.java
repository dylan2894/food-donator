package com.fooddonator.restapi.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.PropertySource;

import com.fooddonator.restapi.model.Donor;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.stargate.grpc.StargateBearerToken;
import io.stargate.proto.QueryOuterClass;
import io.stargate.proto.QueryOuterClass.ResultSet;
import io.stargate.proto.QueryOuterClass.Row;
import io.stargate.proto.StargateGrpc;

import org.json.simple.JSONObject;

@PropertySource("classpath:src/main/resources/application.properties")
public class DonorRepository {

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

  public JSONObject createDonor(String name, Map<String, String> coords, String phone_num) {
    this.config();

    if(name.equals("") || coords.equals("") || phone_num.equals("")) {
      JSONObject resp = new JSONObject();
      resp.put("error", "Provide name, coords and phone_num");
      return resp;
    }

    UUID id = UUID.randomUUID();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("INSERT INTO main_keyspace.donor (id, name, coords, phone_num) VALUES ('"+id+"', '"+name+"', ('"+coords.get("lat")+"', '"+coords.get("lon")+"'), '"+phone_num+"') IF NOT EXISTS;")
    .build()); 

    ResultSet rs = queryString.getResultSet();
    JSONObject response = new JSONObject();
    for (Row row : rs.getRowsList()) {
      response.putAll(row.getAllFields());
    }

    return response;
  }

  public Donor getDonor(String id) {
    this.config();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("SELECT * FROM main_keyspace.donor WHERE id=\'"+id+"\';")
    .build()); 

    ResultSet rs = queryString.getResultSet();
    Row row = rs.getRows(0);

    String name = row.getValues(1).getString();
    String phone_num = row.getValues(2).getString();
    String lat = row.getValues(3).getCollection().getElements(0).toString();
    String lon = row.getValues(3).getCollection().getElements(1).toString();

    return new Donor(id, name, phone_num, lat, lon);
  }

  public List<Donor> getDonors() {
    this.config();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("SELECT * FROM main_keyspace.donor;")
    .build());

    ResultSet rs = queryString.getResultSet();
    List<Row> list = rs.getRowsList();

    List<Donor> response = new ArrayList<Donor>();
    for (Row row : list) {
      String id = row.getValues(0).getString();
      String lat = row.getValues(1).getCollection().getElements(0).getString();
      String lon = row.getValues(1).getCollection().getElements(1).getString();
      String name = row.getValues(2).getString();
      String phone_num = row.getValues(3).getString();
      Donor donor = new Donor(id, name, phone_num, lat, lon);
      response.add(donor);
    }

    return response;
  }
  
  public JSONObject updateDonor(Donor donor) {
    this.config();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("UPDATE main_keyspace.donor SET name='"+donor.name+"', phone_num='"+donor.phone_num+"', coords=('"+donor.coords.get("lat")+"', '"+donor.coords.get("lon")+"') WHERE id='"+donor.id+"';")
    .build()); 

    ResultSet rs = queryString.getResultSet();
    JSONObject response = new JSONObject();
    for (Row row : rs.getRowsList()) {
      response.putAll(row.getAllFields());
    }

    return response;
  }

  public JSONObject deleteDonor(String id) {
    this.config();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
    .Query.newBuilder()
    .setCql("DELETE FROM main_keyspace.donor WHERE id='"+id+"' IF EXISTS;")
    .build());

    ResultSet rs = queryString.getResultSet();
    JSONObject response = new JSONObject();
    for (Row row : rs.getRowsList()) {
      response.putAll(row.getAllFields());
    }

    return response;
  }

}
