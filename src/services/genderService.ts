'use server'
import { axiosWithAuth } from "@/config/interceptors"
import { IGender, IGetDeleteGender } from "@/types/genderTypes"


export const getAllGenders = async () => {
  const { data } = await axiosWithAuth.get<IGender[]>('/gender/all')
  return data
}

export const deleteGender = async (id: number) => {
  const res = await axiosWithAuth.delete<IGetDeleteGender>(`/gender/delete/${id}`)
  return res
}

export const createGender = async (data: IGender) => {
  const res = await axiosWithAuth.post<IGender>('/gender/create', data)
  return res
}


export const updateGender = async (data: IGender, id: number) => {
  const res = await axiosWithAuth.put<IGender>(`/gender/update/${id}`, data)
  return res
}