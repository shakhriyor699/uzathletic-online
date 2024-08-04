import { IEventSportsmen } from "./eventSportsmenTypes"
import { IEvent } from "./eventTypes"
import { ISportsmanCoach } from "./sportsmanTypes"


interface ILang {
  en: string
  uz: string
  ru: string
}

interface ISportsmen {
  id: number
}

export interface IEventRegistrationSportsmenResponse {
  id: number
  gender_id: number
  name: string
  family_name: string
  chest_number: string
  birth: string
  address: string
  pivot: IEventSportsmen
  coaches: ISportsmanCoach[]
}

export interface IEventRegistrationResponse {
  id: string,
  user_id: string,
  event_id: string,
  city_id: string,
  parent_id?: string,
  gender_id: string,
  name: ILang,
  type: string,
  start_time: string,
  end_time: string,
  description: ILang,
  status: boolean
  sportsmen: IEventRegistrationSportsmenResponse[]
  event: IEvent
  
}

export interface IEventRegistration {
  user_id: string
  event_id: number
  city_id: string
  parent_id?: number
  gender_id: number
  name: ILang
  sport_type_id: number
  attempts: number
  type: string
  description: ILang | []
  start_time: string
  end_time: string
  condition: string
  condition_type: string
  procedure: {
    name: ILang,
    type: ILang
  }
  sportsmen: ISportsmen[]
  
}