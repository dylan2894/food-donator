package com.fooddonator.restapi.utils;

public final class PhoneNumUtil {

  private PhoneNumUtil() {}

  /**
   * Removes the (+XX) international code at the beginning of a phone number, as well as removing the spaces.
   * @param phoneNum a phone number which contains a (+XX) as well as spaces.
   * @return a string without spaces and without an international code
   */
  public static String removeInternationalCode(String phoneNum) {
    return phoneNum.replace(" ", "").substring(5);
  }
}