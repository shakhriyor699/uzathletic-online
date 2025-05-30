
import { updateResult } from "@/services/eventSportsmenService";
import { NextResponse } from "next/server"


// export const DELETE = async (req: Request, { params }: { params: { id: number } }) => {
//   const { id } = params

//   const res = await deleteSportsman(id)
//   return NextResponse.json(res.data)
// }

export const PUT = async (req: Request, { params }: { params: { id: number } }) => {
  const { id } = params
  console.log(id);

  const { event_registration_id, sportsman_id, attempts, result, position, condition } = await req.json()

  console.log(event_registration_id, sportsman_id, attempts, result, position, condition);
  


  const res = await updateResult({ event_registration_id, sportsman_id, attempts, result, position, condition }, id)

  console.log(res);
  

  return NextResponse.json(res.data)
}