package com.fooddonator.restapi.utils;

import java.util.Map;
import com.fooddonator.restapi.model.Donation;

public final class DonationMapper {

  private DonationMapper(){}
  
  public static Donation MapDonationJsonToDonation(Map map) {
    Donation donation = new Donation();
    donation.setID(map.get("id").toString());
    donation.setUserID(map.get("userid").toString());
    donation.setDonationDate(Integer.parseInt(map.get("donation_date").toString()));
    donation.setStartTime(map.get("starttime").toString());
    donation.setEndTime(map.get("endtime").toString());

    return donation;
  }
}
