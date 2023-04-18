export default class PhoneNumUtil {
  /**
   * Converts a phone number starting with 0 to the international +27 South African format
   * @param phoneNum A phone number in the format '0xx xxx xxxx'
   */
  toInternationalCode(phoneNum: string): string {
    let internationalPhoneNum = "";

    if(phoneNum != '' && phoneNum != null) {
      phoneNum = phoneNum.trim().replace(" ", "");
      internationalPhoneNum = "+27".concat(phoneNum);
    }

    return internationalPhoneNum;
  }

  /**
   * Formats a phone number in the following format: (+27) XX XXX XXXX
   * @param phoneNum a candidate phone number in the format: XXXXXXXXX
   */
  format(phoneNum: string): string {
    const fPhoneNum = "(+27) ".concat(phoneNum);
    const firstPiece = fPhoneNum.slice(0, 8);
    const secondPiece = fPhoneNum.slice(8, 11);
    const thirdPiece = fPhoneNum.slice(11);

    return firstPiece + " " + secondPiece + " " + thirdPiece;
  }
}
