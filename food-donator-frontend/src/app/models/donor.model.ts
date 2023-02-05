import { User } from "./user.model";

export class Donor extends User {
  name: string;
  lat: string;
  lon: string;

  constructor(id: string, name: string, phone_num: string, lat: string, lon: string, password?: string) {
    super(id, phone_num, password);
    this.name = name;
    this.lat = lat;
    this.lon = lon;
  }
}
