import { IRoles } from "./rolesTypes"


export interface IGetUser {
  id: number
  role_id: string
  name: string
  email: string
  avatar: string 
  settings?: {
    [key: string]: string
  }
  role: IRoles
}


export interface IRegisterUpdateUser {
  email: string
  password: string
  password_confirmation: string
  name: string
  role_id: number
}

export interface IDeleteUser {
  token: string
}

