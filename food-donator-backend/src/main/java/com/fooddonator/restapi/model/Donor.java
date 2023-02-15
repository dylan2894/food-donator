package com.fooddonator.restapi.model;

public class Donor extends User {
  public String name;
  public Double lat;
  public Double lon;

  public Donor(String _id, String _name, String _phone_num, Double latitude, Double longitude, String _password) {
    super(_id, _phone_num, _password);
    
    lat = latitude;
    lon = longitude;
    password = _password;
  }
}
