import { deleteCountry } from "@/services/countryService"
import { NextResponse } from "next/server"


export const DELETE = async (req: Request, { params }: { params: { countryId: string } }) => {
  const { countryId } = params
  const res = await deleteCountry(countryId)
  return NextResponse.json(res.data)
}