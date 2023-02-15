import { User } from "./user.model";

export interface Donor extends User {
  name: string;
  lat: number;
  lon: number;
}
