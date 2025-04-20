import { ILang } from "./langTypes"

export interface IEventResponse {
  id: string
  parent_id?: string
  country_id: string
  name: ILang
  sport_types?: any[]
  days?: {
    day: string
  }[]
  description: string
  date_from: string
  date_to: string
  status: boolean
  registrations: { [key: string]: any[] }
  event_expiration: { [key: string]: any[] }
}

export interface IEvent {
  id?: number
  parent_id?: number
  country_id: string
  name: ILang
  description: ILang
  date_from: string
  date_to: string
  description_expiration?: ILang
  start_registration_data: string
  days: {
    day: string
  }[]
  end_registration_data: string
  country?: {
    id: number
    name: {
      [key: string]: string
    }
  }
  status?: boolean
}

// interface ICountry {
//   id: number
//   name: string
//   iso3: string
//   iso2: string
//   phonecode: string
//   capital: string
//   currency: string
//   flag: number
// }