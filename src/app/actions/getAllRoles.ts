'use server'

import { getAllRoles } from "@/services/rolesService"

export const getAllRole = async () => {
  const res = await getAllRoles()
  return res
}