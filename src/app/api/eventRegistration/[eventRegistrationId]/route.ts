'use server'

import { deleteEvent, update } from "@/services/eventRegistrationService"
import { NextResponse } from "next/server"




export const DELETE = async (req: Request, { params }: { params: { eventRegistrationId: string } }) => {
  const eventRegistrationId = params.eventRegistrationId
  const res = await deleteEvent(eventRegistrationId)
  return NextResponse.json(res.data)
}

export const PUT = async (req: Request, { params }: { params: { eventRegistrationId: string } }) => {
  const eventRegistrationId = params.eventRegistrationId
  const { user_id, event_id, city_id, gender_id, sport_type_id, name, attempts, type, description, start_time, end_time, condition, condition_type, procedure, sportsmen } = await req.json()
  const res = await update({ user_id, event_id, city_id, gender_id, sport_type_id, name, attempts, type, description, start_time, end_time, condition, condition_type, procedure, sportsmen }, eventRegistrationId)
  return NextResponse.json(res.data)
}