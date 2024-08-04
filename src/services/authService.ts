'use server'
import { axiosClassic } from "@/config/interceptors"
import { IAuthForm, IAuthResponse } from "@/types/authTypes"
import { cookies } from "next/headers"


export const login = async (data: IAuthForm) => {
  const res = await axiosClassic.post<IAuthResponse>(`/auth/login`, data)
  if (res.data.token) {
    cookies().set('token', res.data.token)
  }
  return res
}

export const logout = async (token: string | undefined) => {
  const res = await axiosClassic.get('/users/logout', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (res.data) cookies().delete('token')
  return res
}