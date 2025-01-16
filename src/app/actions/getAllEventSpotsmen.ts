'use server'

import { getAll } from "@/services/eventSportsmenService"



export const getAllEventSportsmen = async (page = 1) => {
  const res = await getAll(page)
  return res.data
}