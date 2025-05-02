import { deleteSportsman, update } from "@/services/sportsmanService"
import { NextResponse } from "next/server"


export const DELETE = async (req: Request, { params }: { params: { id: number } }) => {
  const { id } = params

  const res = await deleteSportsman(id)
  return NextResponse.json(res.data)
}

export const PUT = async (req: Request, { params }: { params: { id: number } }) => {
  const { id } = params
  console.log(id);
  
  const { name, gender_id, birth, address, family_name, chest_number, coaches, sportsmen_disciplines } = await req.json()
  console.log(name, gender_id, birth, address, family_name, chest_number, coaches, sportsmen_disciplines);
  
  const res = await update({ name, gender_id, birth, address, family_name, chest_number, coaches, sportsmen_disciplines }, id)

  return NextResponse.json('res.data')
}