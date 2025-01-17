'use server'

import { getAll, getOne } from "@/services/eventSportsmenService"



export const getEventSportsmenById = async (id: string) => {
  const res = await getOne(id)
  return res
}