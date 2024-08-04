'use server'
import { axiosWithAuth } from "@/config/interceptors"
import {  IRoles } from "@/types/rolesTypes"


export const getAllRoles = async () => {
  const { data } = await axiosWithAuth.get('/roles/all')
  return data
}

export const deleteRole = async (id: number) => {
  const res = await axiosWithAuth.delete(`/roles/delete/${id}`)
  return res
}

export const createRole = async (data: any) => {
  const res = await axiosWithAuth.post('/roles/create', data)
  return res
}

export const updateRole = async (data: IRoles, id: number) => {
  const res = await axiosWithAuth.put<IRoles>(`/roles/update/${id}`, data)
  return res
}