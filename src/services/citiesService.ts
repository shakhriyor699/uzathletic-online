'use server'
import { axiosWithAuth } from "@/config/interceptors"
import { ICountryCreate } from "@/types/countryTypes"



export const createCity = async (id: string, data: ICountryCreate) => {
  const res = await axiosWithAuth.post(`/cities/create/by-id-of/${id}`, data)
  return res
}

export const deleteCity = async (id: string) => {
  const res = await axiosWithAuth.delete(`/cities/delete/${id}`)
  return res
}