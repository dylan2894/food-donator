package com.fooddonator.restapi.utils;

import java.util.Map;
import com.fooddonator.restapi.model.User;

public final class UserMapper {

  private UserMapper(){}
  
  public static User mapUserJsonToUser(Map map) {
    User user = new User();
    user.id = map.get("id").toString();
    user.password =map.get("password").toString();
    user.phone_num = map.get("phone_num").toString();
    user.salt = map.get("salt").toString();
    user.lat = ((Number) map.get("lat")).doubleValue();
    user.lon = ((Number) map.get("lon")).doubleValue();
    user.name = map.get("name").toString();
    user.type = map.get("type").toString();

    return user;
  }
}
