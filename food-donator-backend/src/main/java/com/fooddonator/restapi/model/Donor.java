package com.fooddonator.restapi.model;

import java.util.HashMap;

public class Donor {
  public final String id;
  public final String name;
  public final HashMap<String, String> coords;
  public final String phone_num;

  public Donor(String _id, String _name, String _phone_num, String latitude, String longitude) {
    id = _id;
    name = _name;
    phone_num = _phone_num;
    coords = new HashMap<>();
    coords.put("lat", latitude);
    coords.put("lon", longitude);
  }
}
