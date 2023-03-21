export interface RegisterUserInput {
  name: string,
  type: string,
  phone_num: string,
  password: string,
  lat?: number,
  lon?: number
}
