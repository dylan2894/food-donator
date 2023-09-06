package com.fooddonator.restapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSettings {
  public String phone_num;
  public Boolean poi;
  public Boolean transit;
  public Boolean administrative;
  public Boolean dark_map;
}
