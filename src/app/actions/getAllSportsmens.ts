'use server'

import { getAll } from "@/services/sportsmanService"



export const getAllSportsmens = async (page = 1, name?: string, gender?: number | null, address?: string, eventType?: number | null, chest_number: string = '') => {
  console.log(chest_number, 'chest_number');

  const data = await getAll(page, name, gender, address, eventType, chest_number)

  return data
}