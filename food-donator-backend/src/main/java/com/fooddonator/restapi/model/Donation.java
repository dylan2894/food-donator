package com.fooddonator.restapi.model;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor()
@NoArgsConstructor()
public class Donation {
  public String id;
  public String userid;
  public Long donationdate;
  public String starttime;
  public String endtime;
  public String description;
}
