import { createEvent, getAllEvents } from "@/services/eventService"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { name, description, country_id, date_from, date_to, start_registration_data, end_registration_data, description_expiration, days } = await req.json()
  const res = await createEvent({ name, description, country_id, date_from, date_to, start_registration_data, end_registration_data, description_expiration, days })
  return NextResponse.json(res.data)
}