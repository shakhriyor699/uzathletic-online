'use server'
import { axiosWithAuth } from '@/config/interceptors'
import { IDeleteUser, IGetUser, IRegisterUpdateUser } from '@/types/userTypes'

export const getAllUsers = async () => {
  const { data } = await axiosWithAuth.get<IGetUser[]>('/users/all')
  return data
}

export const registerUser = async (data: IRegisterUpdateUser) => {
  const res = await axiosWithAuth.post<IRegisterUpdateUser>('/users/register', data)
  return res
}
export const updateUser = async (data: IRegisterUpdateUser, id: number) => {
  const res = await axiosWithAuth.put<IRegisterUpdateUser>(`/users/update/${id}`, data)
  return res
}

export const deleteUser = async (id: number) => {
  const res = await axiosWithAuth.delete<IDeleteUser>(`/users/delete/${id}`)
  return res
}