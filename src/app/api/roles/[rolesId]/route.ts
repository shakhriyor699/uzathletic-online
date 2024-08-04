import { deleteRole } from "@/services/rolesService"
import { NextResponse } from "next/server"


export const DELETE = async (req: Request, { params }: { params: { rolesId: number } }) => {
  const res = await deleteRole(params.rolesId)
  return NextResponse.json(res.data)
}