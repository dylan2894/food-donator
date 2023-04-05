export default class DateUtil {

  static MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  epochDateToReadable(epochDate: number): string {
    const date = new Date(epochDate + 86400000); // plus one day in ms to match timezone (GMT+2)
    return date.toISOString().split('T')[0];
  }

  numericToTextDate(numericDate: string): string {
    const year = numericDate.substring(0, 4);
    let month = numericDate.substring(5, 7);
    month = this.mapMonthIntToMonthString(month);
    const day = numericDate.substring(8);

    return day + " " + month + " " + year;
  }

  private mapMonthIntToMonthString(monthNumber: string): string {
    const monthInt = parseInt(monthNumber);
    return DateUtil.MONTHS.at(monthInt-1)!;
  }
}
