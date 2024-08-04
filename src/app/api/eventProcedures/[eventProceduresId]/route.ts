import { deleteEventProcedures } from "@/services/eventProceduresService"
import { NextResponse } from "next/server"


export const DELETE = async (req: Request, { params }: { params: { eventProceduresId: string } }) => {
  const eventProceduresId = params.eventProceduresId
  const res = await deleteEventProcedures(eventProceduresId)
  return NextResponse.json(res.data)
}