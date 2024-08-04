import { IRoles } from "./rolesTypes"

export interface IAuthForm {
  email: string
  password: string
}

export interface IUser {
  email: string
  password: string
  password_confirmation: string
  name: string
  role_id: number
}




export interface IUserData {
  id: number
  role_id: number
  name: string
  email: string
  avatar: string
  settings: string[]
  role: IRoles
}


export interface IAuthResponse {
  token: string,
  'user-data': IUserData
}
