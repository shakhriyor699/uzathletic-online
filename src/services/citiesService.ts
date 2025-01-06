'use server'
import { axiosWithAuth } from "@/config/interceptors"
import { ICountryCreate } from "@/types/countryTypes"


export const getCities = async () => {
  const { data } = await axiosWithAuth.get('/cities/all')
  return data
}


export const getCitiesByCountry = async (id: string) => {
  const { data } = await axiosWithAuth.get(`/countries/get-city-by-country/${id}`)
  return data
}



export const createCity = async (id: string, data: ICountryCreate) => {
  const res = await axiosWithAuth.post(`/cities/create/by-id-of/${id}`, data)
  return res
}

export const deleteCity = async (id: string) => {
  const res = await axiosWithAuth.delete(`/cities/delete/${id}`)
  return res
}