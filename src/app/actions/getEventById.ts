'use server'

import { getEventChildren } from "@/services/eventService"



export const getEventById = async (id: string) => {
  const res = await getEventChildren(id)
  return res
}

export const transformData = async (id: string) => {
  const event = await getEventById(id)
  return event.days?.map(dayObj => {
    const date = dayObj.day;
    const events = event.registrations[date] || [];
    return {  
      date,
      events
    };
  });
};