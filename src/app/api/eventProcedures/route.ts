import { createEventProcedures } from "@/services/eventProceduresService"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { name, type } = await req.json()
  const res = await createEventProcedures({ name, type }) 
  return NextResponse.json(res.data)
}

