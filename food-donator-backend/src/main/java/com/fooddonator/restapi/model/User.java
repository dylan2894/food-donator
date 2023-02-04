package com.fooddonator.restapi.model;

public class User {
  public String id;
  public String phone_num;
  public String password;
  public String salt;

  User(String _id, String _phone_num, String _password, String _salt) {
    id = _id;
    phone_num = _phone_num;
    password = _password;
    salt = _salt;
  }
}
