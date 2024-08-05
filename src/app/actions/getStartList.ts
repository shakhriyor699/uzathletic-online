'use server'

import { getStartList } from "@/services/startListService"




export const getStartLists = async (id: string) => {
  const res = await getStartList(id)
  return res
}