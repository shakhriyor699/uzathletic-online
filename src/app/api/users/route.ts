import { registerUser } from "@/services/userService"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { name, email, password, password_confirmation, role_id } = await req.json()
  const res = await registerUser({ name, email, password, password_confirmation, role_id })
  return NextResponse.json(res.data)
}