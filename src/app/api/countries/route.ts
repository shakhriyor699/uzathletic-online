import { createCountry } from "@/services/countryService"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
  const { name } = await req.json()
  console.log(name);

  const res = await createCountry({ name })
  return NextResponse.json(res.data)
}