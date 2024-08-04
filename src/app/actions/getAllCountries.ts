'use server'

import { getAllCountries } from "@/services/countryService"

export const getAllCountry = async () => {
  const res = await getAllCountries()
  return res
}