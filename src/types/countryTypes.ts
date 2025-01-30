import { ILang } from "./langTypes"


export interface ICountry {
  id: number
  name: ILang
}

export interface ICountryCreate {
  name: ILang
}

export interface ICity {
  id: number
  country_id: number
  name: ILang,
  country: ICountry
}

export interface ICityByCountry {
  id: number
  name: ILang
  cities: ICity[]
}