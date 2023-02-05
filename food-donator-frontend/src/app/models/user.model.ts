export class User {
  id: string;
  phone_num: string;
  password?: string;

  constructor(id: string, phone_num: string, password?: string) {
    this.id = id;
    this.phone_num = phone_num;
    this.password = password;
  }
}
