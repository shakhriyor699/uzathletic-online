import { ILang } from "./langTypes"


export interface StartListType {
  event_registration_id: number
  sportsmen: {
    id: number
    position: number
  }[]
}


export interface StartListResponse {
  data: {
    id: string,
    sportsmen_id: string,
    event_registration_id: string,
    position: string
  }
}

export interface StartListSportsmen {
  id: number
  event_registration_id: number
  sportsmen: {
    [key: string]: any
  }
 
}

export interface IStartList  {
  id: number
  user_id: number
  event_id: number
  city_id: number
  parent_id?: null
  gender_id: number
  sport_type_id: number
  name: ILang
  attempts: string
  type: string
  start_time: string
  end_time: string
  description: ILang
  status:  boolean | null
  sportsmen_sortable: StartListSportsmen[]
}