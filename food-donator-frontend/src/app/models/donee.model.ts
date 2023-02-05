import { User } from "./user.model";

export class Donee extends User {

  constructor(id: string, phone_num: string, password: string) {
    super(id, phone_num, password);
  }
}
