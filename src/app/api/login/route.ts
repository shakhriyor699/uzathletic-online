import { axiosClassic } from "@/config/interceptors"
import { login } from "@/services/authService"
import { IAuthResponse } from "@/types/authTypes"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { email, password } = await req.json()
  const res = await login({ email, password })
  console.log(email, password);
  
  return NextResponse.json(res.data)
}