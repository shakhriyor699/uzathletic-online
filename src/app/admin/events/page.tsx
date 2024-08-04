import { getAllCountry } from '@/app/actions/getAllCountries'
import { getAllevents } from '@/app/actions/getAllevents'
import { getCurrentUser } from '@/app/actions/getCurrentUser'
import EventsClient from '@/components/AdminClient/EventsClient/EventsClient'
import AddCountriesModal from '@/components/Modals/AddCountriesModal'
import CreateModal from '@/components/Modals/CreateModal'
import React from 'react'

export const revalidate = 3600

const EventsPage = async () => {
  const events = await getAllevents()
  const currentUser = await getCurrentUser()
  const getAllCountries = await getAllCountry()


  return (
    <>
      <EventsClient data={events.data} currentUser={currentUser['user-data']} />
      <CreateModal countries={getAllCountries} />
      <AddCountriesModal countries={getAllCountries}/>
    </>
  )
}

export default EventsPage