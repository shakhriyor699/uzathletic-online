import { deleteSportsman } from "@/services/sportsmanService"
import { NextResponse } from "next/server"


export const DELETE = async (req: Request, { params }: { params: { id: number } }) => {
  const { id } = params
  console.log(id);
  
  const res = await deleteSportsman(id)
  return NextResponse.json('res.data')
}