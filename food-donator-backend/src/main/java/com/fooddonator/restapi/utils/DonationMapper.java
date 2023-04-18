package com.fooddonator.restapi.utils;

import java.util.Map;
import com.fooddonator.restapi.model.Donation;

public final class DonationMapper {

  private DonationMapper(){}
  
  public static Donation MapDonationJsonToDonation(Map map) {
    Donation donation = new Donation();

    if(map.get("id") != null){
      donation.id = map.get("id").toString();
    }
    if(map.get("userid") != null){
      donation.userid = map.get("userid").toString();
    }
    if(map.get("donationdate") != null){
      donation.donationdate = Long.parseLong(map.get("donationdate").toString());
    }
    if(map.get("starttime") != null){
      donation.starttime = map.get("starttime").toString();
    }
    if(map.get("endtime") != null){
      donation.endtime = map.get("endtime").toString();    
    }
    if(map.get("description") != null){
      donation.description = map.get("description").toString();
    }
    if(map.get("reserved") != null) {
      donation.reserved = (Boolean) map.get("reserved");
    }
  
    return donation;
  }
}
