


export interface ISportsmanCoach {
  id: number
  gender_id: number
  name: string
  family_name: string
}

export interface ISportsmanDesciplines {
  name: string
  pb: string
  sb: string
}

export interface ICreateSportsman {
  gender_id: number
  name: string
  birth: string
  address: string
  family_name: string
  chest_number: string
  coaches: ISportsmanCoach[]
  sportsmen_disciplines: ISportsmanDesciplines[]
  event_registration: {
    id: number
  }[]
}

export interface ISportsman {
  id: number
  gender_id: number
  name: string
  family_name: string
  chest_number: string
  birth: string
  coaches: ISportsmanCoach[]
  sportsmen_disciplines: ISportsmanDesciplines[]
  address: string
  gender: {
    id: number
    name: string | any
    type?: string
    parent_id?: null
  }
}


