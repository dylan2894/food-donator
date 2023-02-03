package com.fooddonator.restapi.model;

import java.util.HashMap;

public class Donor {
  public String id;
  public String name;
  public String lat;
  public String lon;
  public String phone_num;

  public Donor() {}

  public Donor(String _id, String _name, String _phone_num, String latitude, String longitude) {
    id = _id;
    name = _name;
    phone_num = _phone_num;
    lat = latitude;
    lon = longitude;
  }
}
