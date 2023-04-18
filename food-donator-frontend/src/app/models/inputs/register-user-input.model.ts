export interface RegisterUserInput {
  name: string,
  type: string,
  phone_num: string,
  password: string,
  address?: string,
  lat?: number,
  lon?: number
}
