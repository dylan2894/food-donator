package com.fooddonator.restapi.model;

import java.time.LocalTime;

public class Donation {
  private String id;
  private String userId;
  private Integer donation_date;
  private LocalTime startTime;
  private LocalTime endTime;

  public Donation() {}

  public String getID() {
    return id;
  }

  public String getUserID() {
    return userId;
  } 

  public Integer getDonationDate() {
    return donation_date;
  }

  public LocalTime getStartTime() {
    return startTime;
  }

  public LocalTime getEndTime() {
    return endTime;
  }

  public void setID(String _id) {
    id = _id;
  }

  public void setUserID(String _userId) {
    userId = _userId;
  }

  public void setDonationDate(Integer donationDate) {
    donation_date = donationDate;
  }

  public void setStartTime(LocalTime _startTime) {
    startTime = _startTime;
  }

  public void setStartTime(String _startTime) {
    //TODO convert from stored string format to LocalTime
    // char[] hour;
    // char[] min;
    // char[] sec;
    // _startTime.getChars(0, 2, hour, 0);
    // _startTime.getChars(3, 5, min, 0);
    // _startTime.getChars(7, 9, hour, 0);

    // int ihour = Integer.parseInt(hour.toString());
    // int imin = Integer.parseInt(min.toString());
    // int isec = Integer.parseInt(sec.toString());

    startTime = LocalTime.parse(_startTime);
  }

  public void setEndTime(LocalTime _endTime) {
    //TODO convert from stored string format to LocalTime
    endTime = _endTime;
  }

  public void setEndTime(String _endTime) {
    endTime = LocalTime.parse(_endTime);
  }

}
