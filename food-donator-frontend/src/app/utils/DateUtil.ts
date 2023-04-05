export default class DateUtil {
  epochDateToReadable(epochDate: number): string {
    const date = new Date(epochDate + 86400000); // plus one day in ms to match timezone (GMT+2)
    return date.toISOString().split('T')[0];
  }
}
