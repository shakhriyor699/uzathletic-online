'use server'
import { axiosWithAuth } from "@/config/interceptors"
import { ISportType } from "@/types/sportTypeTypes"


export const getAllSportTypesService = async (page = 1) => {
  const { data } = await axiosWithAuth.get(`/sport-type/all?paginate=${page}`)
  return data.data
}