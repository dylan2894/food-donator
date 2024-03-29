package com.fooddonator.restapi.model;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor()
@NoArgsConstructor()
public class Donation implements Comparable<Donation> {
  public String id;
  public String userid;
  public Long donationdate;
  public String starttime;
  public String endtime;
  public String description;
  public Boolean reserved;
  public ArrayList<String> recipients;

  @Override
  public int compareTo(Donation donation) {
      return getDonationdate().compareTo(donation.getDonationdate());
  }
}
