'use server'

import { getAllGenders } from "@/services/genderService"


export const getAllGender = async () => {
  const res = await getAllGenders()
  return res
}