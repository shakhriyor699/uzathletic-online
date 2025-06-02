'use server'
import { axiosWithAuth } from "@/config/interceptors"
import { IEventRegistration, IEventRegistrationResponse } from "@/types/eventRegistrationTypes"

export const create = async (data: IEventRegistration) => {
  const res = await axiosWithAuth.post<IEventRegistrationResponse>('/event-registration/create', data)
  return res
}

export const getAll = async (page = 1) => {
  const { data } = await axiosWithAuth.get(`/event-registration/all?paginate=${page}`)
  return data.data
}


export const deleteEvent = async (id: string) => {
  const res = await axiosWithAuth.delete<IEventRegistrationResponse>(`/event-registration/delete/${id}`)
  return res
}

export const getOne = async (id: string) => {
  const { data } = await axiosWithAuth.get<IEventRegistrationResponse>(`/event-registration/show/${id}`)
  return data
}

export const update = async (data: IEventRegistration, id: number | string) => {
  const res = await axiosWithAuth.put<IEventRegistrationResponse>(`/event-registration/update/${id}`, data)
  return res
}