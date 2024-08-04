'use server'

import { getAllSportTypesService } from "@/services/sportTypeService"


export const getAllSportTypes = async (page = 1) => {
  const res = await getAllSportTypesService(page)
  return res
}