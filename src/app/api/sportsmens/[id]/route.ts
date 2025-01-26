import { deleteSportsman, update } from "@/services/sportsmanService"
import { NextResponse } from "next/server"


export const DELETE = async (req: Request, { params }: { params: { id: number } }) => {
  const { id } = params

  const res = await deleteSportsman(id)
  return NextResponse.json(res.data)
}

export const PUT = async (req: Request, { params }: { params: { id: number } }) => {
  const { id } = params
  const { name, gender_id, birth, address, family_name, chest_number, coaches, sportsmen_disciplines, event_registration } = await req.json()
  const res = await update({ name, gender_id, birth, address, family_name, chest_number, coaches, sportsmen_disciplines, event_registration }, id)

  return NextResponse.json(res.data)
}