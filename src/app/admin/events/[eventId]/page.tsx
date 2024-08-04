import { getAllEventProcedures } from '@/app/actions/getAllEventProcedures'
import { getAllSportTypes } from '@/app/actions/getAllSportTypes'
import { getUsers } from '@/app/actions/getAllUsers'
import { getCityByCountries } from '@/app/actions/getCityByCountry'
import { getEventById, transformData } from '@/app/actions/getEventById'
import EventRegistration from '@/components/AdminClient/EventsClient/EventRegistration/EventRegistration'
import AddCitiesModal from '@/components/Modals/AddCitiesModal'
import AddEventProceduresModal from '@/components/Modals/AddEventProceduresModal'
import CreateEventRegistratiomModal from '@/components/Modals/CreateEventRegistratiomModal'
import React, { FC } from 'react'

interface Params {
  params: {
    eventId: string
  }
}


const Page: FC<Params> = async ({ params }) => {
  const getEvent = await getEventById(params.eventId)
  const days = await transformData(params.eventId)
  const sportTypes = await getAllSportTypes(1)
  const users = await getUsers()
  const { data: eventProcedures } = await getAllEventProcedures(1)
  const cityByCountry = await getCityByCountries(getEvent.country_id)


  return (
    <>
      <EventRegistration event={getEvent} days={days} />
      <CreateEventRegistratiomModal
        sportTypes={sportTypes}
        eventProcedures={eventProcedures}
        users={users}
        event={getEvent}
        cityByCountry={cityByCountry}
      />
      <AddEventProceduresModal eventProcedures={eventProcedures} />
      <AddCitiesModal cityByCountry={cityByCountry} />
    </>
  )
}

export default Page