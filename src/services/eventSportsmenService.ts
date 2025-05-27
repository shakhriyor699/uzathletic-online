'use server'

import { axiosWithAuth } from "@/config/interceptors"
import { IEventSportsmen } from "@/types/eventSportsmenTypes"

export const createOrUpdate = async (data: IEventSportsmen) => {
  const res = await axiosWithAuth.post<IEventSportsmen>('/event-sportsmen/event/create', data)
  return res
}

export const getAll = async (page = 1) => {
  const { data } = await axiosWithAuth.get(`/event-sportsmen/all?page=${page}`)
  return data
}

export const deleteEvent = async (id: number) => {
  const res = await axiosWithAuth.delete(`/event-sportsmen/delete/${id}`)
  return res
}

export const getOne = async (id: string) => {
  const { data } = await axiosWithAuth.get(`/event-sportsmen/show/${id}`)
  return data
}