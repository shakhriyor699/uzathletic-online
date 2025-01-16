import { create } from "@/services/eventRegistrationService"
import { createOrUpdate } from "@/services/eventSportsmenService"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { event_registration_id, sportsman_id, attempts, result, position, condition } = await req.json()
  const res = await createOrUpdate({ event_registration_id, sportsman_id, attempts, result, position, condition })
  return NextResponse.json(res.data)
}
