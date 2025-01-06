'use server'

import { getCities } from "@/services/citiesService"


export const getAllCities = async () => {
  const res = await getCities()
  return res
}