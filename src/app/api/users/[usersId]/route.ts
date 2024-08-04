import { deleteUser } from "@/services/userService"
import { NextResponse } from "next/server"


export const DELETE = async (req: Request, { params }: { params: { usersId: number } }) => {
  const res = await deleteUser(params.usersId)
  return NextResponse.json(res.data)
}