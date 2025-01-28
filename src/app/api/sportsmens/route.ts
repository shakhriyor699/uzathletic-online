import { create } from "@/services/sportsmanService"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { name, gender_id, birth, address, family_name, chest_number, coaches, sportsmen_disciplines } = await req.json()
  console.log({ name, gender_id, birth, address, family_name, chest_number, coaches, sportsmen_disciplines });

  const res = await create({ name, gender_id, birth, address, family_name, chest_number, coaches, sportsmen_disciplines })
  return NextResponse.json(res.data)
}