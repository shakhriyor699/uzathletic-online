

export interface IGenderNameType {
  en: string
  uz: string
  ru: string
}

export interface IGender {
  id: string
  parent_id: string | null
  name: IGenderNameType
  type: IGenderNameType
}

export interface IGetDeleteGender {
  id: string
  name: string
  type: string
}