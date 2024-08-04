'use server'

import { getAll } from "@/services/sportsmanService"



export const getAllSportsmens = async (page = 1) => {
const { data } = await getAll(page)
  return data
}