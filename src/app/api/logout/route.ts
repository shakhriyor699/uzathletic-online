import { logout } from "@/services/authService"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export const GET = async (req: Request) => {
  const cookie = cookies().get('token')?.value
  const res = await logout(cookie)
  return NextResponse.json(res.data)
}