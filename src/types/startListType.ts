

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
  gender_id: number
  name: string
  family_name: string
  chest_number: string
  birth: string
  address: string
}