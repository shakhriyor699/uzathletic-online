'use server'

import { deleteEvent } from "@/services/eventRegistrationService"
import { NextResponse } from "next/server"


export const DELETE = async (req: Request, { params }: { params: { eventRegistrationId: string } }) => {
  const eventRegistrationId = params.eventRegistrationId
  const res = await deleteEvent(eventRegistrationId)
  return NextResponse.json(res.data)
}