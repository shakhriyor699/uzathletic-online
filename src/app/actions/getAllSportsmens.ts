'use server'

import { getAll } from "@/services/sportsmanService"



export const getAllSportsmens = async (page = 1, name?: string, gender?: number, address?: string, eventType?: number) => {
  const data = await getAll(page, name, gender, address, eventType)
  return data
}