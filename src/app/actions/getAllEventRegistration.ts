'use server'

import { getAll } from "@/services/eventRegistrationService"


export const getAllEventRegistrations = async (page = 1) => {
  const res = await getAll(page)
  return res
}