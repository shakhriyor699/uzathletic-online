'use server'

import { axiosWithAuth } from "@/config/interceptors"
import { IEventProcedure } from "@/types/eventProcedures"


export const getEventProcedures = async (page = 1) => {
  const { data } = await axiosWithAuth.get(`/event-procedure/all?page=${page}`)
  return data
}

export const createEventProcedures = async (data: IEventProcedure) => {
  const res = await axiosWithAuth.post('/event-procedure/create', data)
  return res
}

export const deleteEventProcedures = async (id: string) => {
  const res = await axiosWithAuth.delete(`/event-procedure/delete/${id}`)
  return res
}