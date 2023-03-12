export default class DateUtil {
  epochDateToReadable(epochDate: number): string {
    const date = new Date(epochDate);
    return date.toISOString().split('T')[0];
  }
}
