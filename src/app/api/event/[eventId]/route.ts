import { deleteEvent } from "@/services/eventService"
import { NextResponse } from "next/server"


export const DELETE = async (req: Request, { params }: { params: { eventId: string } }) => {
  const { eventId } = params
  const res = await deleteEvent(eventId)
  return NextResponse.json(res.data)
}