package com.fooddonator.restapi.model;


//import org.springframework.data.annotation.Id;
//import javax.validation.constraints.NotBlank;

public class User {
  //@Id
  //@NotBlank(message = "ID is mandatory")
  public String id;
  //@NotBlank(message = "Phone number is mandatory")
  public String phone_num;
  public String password;
  public String salt;
  public Double lat;
  public Double lon;
  public String type;
  public String name;

  public User() {
    
  }

  public User(String _name, String _id, String _phone_num, String _password, String _salt, Double _lat, Double _lon, String _type) {
    name = _name;
    id = _id;
    phone_num = _phone_num;
    password = _password;
    salt = _salt;
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
