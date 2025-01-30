'use server'

import { getAll } from "@/services/sportsmanService"



export const getAllSportsmens = async (page = 1, name?: string) => {
  const data = await getAll(page, name)
  return data
}