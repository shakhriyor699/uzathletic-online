
export interface IAttempts {
  first: string
  second: string
  third: string
  fourth?: string
  fives?: string
  sixes?: string
}

export interface IEventSportsmen {
  event_registration_id: number
  sportsman_id: number
  attempts: IAttempts[]
  result: string
  position: string
  status?: boolean | null
  condition: string
}