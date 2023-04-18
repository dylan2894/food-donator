package com.fooddonator.restapi.model;

public class User {
  public String id;
  public String phone_num;
  public String password;
  public String salt;
  public String address;
  public Double lat;
  public Double lon;
  public String type;
  public String name;

  public User() {
    
  }

  public User(String _name, String _id, String _phone_num, String _password, String _salt, String _address, Double _lat, Double _lon, String _type) {
    name = _name;
    id = _id;
    phone_num = _phone_num;
    password = _password;
    salt = _salt;
    address = _address;
    lat = _lat;
    lon = _lon;
    type = _type;
  }

  public User(String _name, String _phone_num, String _password, String _salt, String _address, Double _lat, Double _lon, String _type) {
    name = _name;
    phone_num = _phone_num;
    password = _password;
    salt = _salt;
    address = _address;
    lat = _lat;
    lon = _lon;
    type = _type;
  }

  public User(String _id, String _phone_num, String _password) {
    id = _id;
    phone_num = _phone_num;
    password = _password;
  }
}
