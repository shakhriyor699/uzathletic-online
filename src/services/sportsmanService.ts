'use server'
import { axiosWithAuth } from "@/config/interceptors"
import { ICreateSportsman, ISportsman } from "@/types/sportsmanTypes"

export const create = async (data: ICreateSportsman) => {
  const res = await axiosWithAuth.post<ICreateSportsman>('/sportsman/create', data)
  return res
}

export const getAll = async (page = 1, name?: string, gender?: number | null, address?: string, eventType?: number | null, chest_number: string = '', is_archive:boolean = true) => {
  console.log(chest_number, 'chest_number');

  const { data } = await axiosWithAuth.get(`/sportsman/all?pagw=${page}${gender ? `&gender=${gender}` : ''}${address ? `&address=${address}` : ''}${eventType ? `&event-type=${eventType}` : ''}${chest_number ? `&chest_number=${chest_number}` : ''}&is_archive=${is_archive}`, {
    params: {
      name,
      limit: 10
    }
  })
  // try {
  //   const { data } = await axiosWithAuth.get('/sportsman/all', {
  //     params: {
  //       page,
  //       name,
  //       limit: 10,
  //       ...(gender && { gender }),
  //       ...(address && { address }),
  //       ...(eventType && { 'event-type': eventType }),
  //       ...(chest_number && { chest_number }),
  //     }
  //   });
  //   console.log(data, 'data from getAll');

  //   return data;
  // } catch (error) {
  //   console.error('Request failed:', error);
  //   throw error;
  // }
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