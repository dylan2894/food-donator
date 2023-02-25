export interface User {
  id: string;
  phone_num: string;
  password?: string;
  salt?: string;
  lat?: number;
  lon?: number;
  type: string;
  name?: string;
}
