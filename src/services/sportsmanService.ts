'use server'
import { axiosWithAuth } from "@/config/interceptors"
import { ICreateSportsman, ISportsman } from "@/types/sportsmanTypes"

export const create = async (data: ICreateSportsman) => {
  const res = await axiosWithAuth.post<ICreateSportsman>('/sportsman/create', data)
  return res
}

export const getAll = async (page = 1, name?: string, gender?: number | null, address?: string, eventType?: number | null, is_archive?: boolean, chest_number: string = '') => {
  const { data } = await axiosWithAuth.get(`/sportsman/all?page=${page}${gender ? `&gender=${gender}` : ''}${address ? `&address=${address}` : ''}${eventType ? `&event-type=${eventType}` : ''}${chest_number ? `&chest_number=${chest_number}` : ''}`, {
    params: {
      name,
      limit: 10
    }
  })
  return data
}

export const update = async (data: ICreateSportsman, id: number) => {
  const res = await axiosWithAuth.put<ICreateSportsman>(`/sportsman/update/${id}`, data)
  return res
}

export const deleteSportsman = async (id: number) => {
  const res = await axiosWithAuth.delete(`/sportsman/delete/${id}`)
  return res
}

export const getOne = async (id: number) => {
  const { data } = await axiosWithAuth.get<ISportsman>(`/sportsman/show/${id}`)
  return data
}