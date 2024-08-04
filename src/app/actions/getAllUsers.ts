'use server'

import { getAllUsers } from "@/services/userService"



export const getUsers = async () => {
  const res = await getAllUsers()
  return res
}