'use server'

import { axiosWithAuth } from "@/config/interceptors"
import { IEvent, IEventResponse } from "@/types/eventTypes"


export const createEvent = async (data: IEvent) => {
  const res = await axiosWithAuth.post<IEventResponse>('/event/create', data)
  return res
}


export const updateEvent = async (data: IEvent, id: string) => {
  const res = await axiosWithAuth.put<IEventResponse>(`/event/update/${id}`, data)
  return res
}

export const deleteEvent = async (id: string) => {
  const res = await axiosWithAuth.delete<IEventResponse>(`/event/delete/${id}`)
  return res
}

export const getAllEvents = async (page = 1) => {
  const res = await axiosWithAuth.get(`/event/all?page=${page}`)
  return res
}

export const getEvent = async (id: string) => {
  const { data } = await axiosWithAuth.get<IEventResponse>(`/event/show/${id}`)
  return data
}

export const getEventChildren = async (id: string) => {
  const { data } = await axiosWithAuth.get<IEventResponse>(`/event/show-event-children/${id}`)
  return data
}