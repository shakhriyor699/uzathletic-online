'use server'

import { getCitiesByCountry } from "@/services/citiesService"


export const getCitiesByCountryId = async (countryId: string) => {
  const res = await getCitiesByCountry(countryId)
  return res
}