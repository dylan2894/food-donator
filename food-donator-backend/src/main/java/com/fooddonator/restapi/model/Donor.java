package com.fooddonator.restapi.model;

public class Donor extends User {
  public String name;
  public String lat;
  public String lon;

  public Donor(String _id, String _name, String _phone_num, String latitude, String longitude, String _password) {
    super(_id, _phone_num, _password);
    
    lat = latitude;
    lon = longitude;
    password = _password;
  }
}
