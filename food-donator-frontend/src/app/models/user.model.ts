export interface User {
  id: string;
  phone_num: string;
  password?: string;
  salt?: string;
  address?: string;
  lat?: number;
  lon?: number;
  type?: string;
  name?: string;
}
