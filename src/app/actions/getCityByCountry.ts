'use server'

import { getCityByCountry } from "@/services/countryService"


export const getCityByCountries = async (id: string) => {
  const res = getCityByCountry(id)
  return res
}