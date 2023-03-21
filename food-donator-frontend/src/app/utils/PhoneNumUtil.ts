export default class PhoneNumUtil {
  /**
   * Converts a phone number starting with 0 to the international +27 South African format
   * @param phoneNum A phone number in the format '0xx xxx xxxx'
   */
  toInternationalCode(phoneNum: string): string {
    let internationalPhoneNum = "";
    phoneNum = phoneNum.trim().replace(" ", "");
    internationalPhoneNum = "+27".concat(phoneNum);

    return internationalPhoneNum;
  }
}
