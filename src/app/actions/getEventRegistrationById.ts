'use server'

import { getOne } from "@/services/eventRegistrationService"




export const getEventRegistrationById = async (id: string) => {
  const res = await getOne(id)
  return res
}