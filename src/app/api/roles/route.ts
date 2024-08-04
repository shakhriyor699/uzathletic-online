import { axiosWithAuth } from "@/config/interceptors"
import { createRole } from "@/services/rolesService"
import axios from "axios"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { name, display_name } = await req.json()
  const res = await createRole({ name, display_name })
  return NextResponse.json(res.data)
}