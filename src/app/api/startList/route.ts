'use server'
import { createStartList } from "@/services/startListService"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { event_registration_id, sportsmen } = await req.json()
  const res = await createStartList({ event_registration_id, sportsmen })
  return NextResponse.json('res.data')
}