import { create } from "@/services/eventRegistrationService"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { user_id, event_id, city_id, gender_id, sport_type_id, name, attempts, type, description, start_time, end_time, condition, condition_type, procedure, sportsmen } = await req.json()
  const res = await create({ user_id, event_id, city_id, gender_id, sport_type_id, name, attempts, type, description, start_time, end_time, condition, condition_type, procedure, sportsmen }) 
  console.log(res.data, gender_id);
  
  return NextResponse.json(res.data)
}
  