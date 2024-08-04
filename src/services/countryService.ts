'use server'
import { axiosWithAuth } from "@/config/interceptors"
import { ICountryCreate } from "@/types/countryTypes"

export const getAllCountries = async () => {
  const { data } = await axiosWithAuth.get('/countries/all')
  return data
}

export const createCountry = async (data: ICountryCreate) => {
  const res = await axiosWithAuth.post('/country/create', data)
  return res
}

export const deleteCountry = async (id: string) => {
  const res = await axiosWithAuth.delete(`/country/delete/${id}`)
  return res
}

export const updateCountry = async (id: string, data: ICountryCreate) => {
  const res = await axiosWithAuth.put(`/country/update/${id}`, data)
  return res
}

export const getCityByCountry = async (id: string) => {
  const { data } = await axiosWithAuth.get(`/countries/get-city-by-country/${id}`)
  return data
}

