'use server'

import { getOne } from "@/services/sportsmanService"


export const getSportsmenById = async (id: number) => {
  const data = getOne(id)
  return data
}