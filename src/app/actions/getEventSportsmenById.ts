'use server'

import { getAll, getOne, getOneTxt } from "@/services/eventSportsmenService"



export const getEventSportsmenById = async (id: string) => {
  const res = await getOne(id)
  return res
}
export const getEventSportsmenByIdTxt = async (id: string) => {
  const res = await getOneTxt(id)
  return res
}