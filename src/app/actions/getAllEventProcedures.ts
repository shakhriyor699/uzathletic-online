'use server'

import { getEventProcedures } from "@/services/eventProceduresService"


export const getAllEventProcedures = async (page = 1) => {
  const res = await getEventProcedures(page)
  return res
}