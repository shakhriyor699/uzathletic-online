'use server'

import { getAll } from "@/services/sportsmanService"



export const getAllSportsmens = async (page = 1, name?: string, gender?: number | null, address?: string, eventType?: number | null, is_archive?: boolean) => {
  const data = await getAll(page, name, gender, address, eventType, is_archive)
  return data
}