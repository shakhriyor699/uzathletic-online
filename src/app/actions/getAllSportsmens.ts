'use server'

import { getAll } from "@/services/sportsmanService"



export const getAllSportsmens = async (page = 1, name?: string, gender?: number, address?: string) => {
  const data = await getAll(page, name, gender, address)
  return data
}