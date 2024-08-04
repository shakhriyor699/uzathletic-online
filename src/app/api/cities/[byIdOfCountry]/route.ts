import { createCity, deleteCity } from "@/services/citiesService"
import { NextResponse } from "next/server"


export const POST = async (req: Request, { params }: { params: { byIdOfCountry: string } }) => {
  const { byIdOfCountry } = params
  const data = await req.json()
  const res = await createCity(byIdOfCountry, data)
  return NextResponse.json(res.data)
}


export const DELETE = async (req: Request, { params }: { params: { byIdOfCountry: string } }) => {
  const { byIdOfCountry } = params
  const res = await deleteCity(byIdOfCountry)
  return NextResponse.json(res.data)
}