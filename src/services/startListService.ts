'use server'

import { axiosWithAuth } from "@/config/interceptors"
import { StartListResponse, StartListType } from "@/types/startListType"


export const createStartList = async (startList: StartListType) => {
  const res = await axiosWithAuth.post<StartListResponse>('/sortable/create', startList)
  return res
}

export const deleteStartList = async (id: string) => {
  const res = await axiosWithAuth.delete<StartListResponse>(`/sortable/delete/${id}`)
  return res.data
}

export const getStartList = async (id: string) => {
  const res = await axiosWithAuth.get(`/sortable/position-by-event/${id}`)
  return res.data
}