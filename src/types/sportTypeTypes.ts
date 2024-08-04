import { ILang } from "./langTypes"





export interface ISportType {
  id: string
  gender_id: number
  sport_type_name: ILang
  sport_type_number: string
  created_at?: string
  updated_at?: string
}