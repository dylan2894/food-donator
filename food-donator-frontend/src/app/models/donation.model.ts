export interface Donation {
  id: string,
  userid: string,
  donationdate: number,
  starttime: string,
  endtime: string,
  description: string,
  reserved: boolean
  recipients: string[];
}
