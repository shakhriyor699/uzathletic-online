import { create } from "@/services/sportsmanService"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { name, gender_id, birth, address, family_name, chest_number, coaches, sportsmen_disciplines, event_registration } = await req.json()
  const res = await create({ name, gender_id, birth, address, family_name, chest_number, coaches, sportsmen_disciplines, event_registration })
  return NextResponse.json(res.data)
}