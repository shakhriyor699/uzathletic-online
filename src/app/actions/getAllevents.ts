'use server'
import { getAllEvents } from "@/services/eventService"


export const getAllevents = async (page = 1) => {
  const res = await getAllEvents(page)
  return res.data
}