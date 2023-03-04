package com.fooddonator.restapi.model;

public class Donation {
  public String id;
  public String userid;
  public Integer donationdate;
  public String starttime;
  public String endtime;

  public Donation() {}

  public Donation(String _id, String _userid, Integer _donationDate, String _starttime, String _endtime) {
    id = _id;
    userid = _userid;
    donationdate = _donationDate;
    starttime = _starttime;
    endtime = _endtime;
  }
}
