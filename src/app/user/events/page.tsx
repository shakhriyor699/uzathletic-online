import { getAllevents } from '@/app/actions/getAllevents'
import { getCurrentUser } from '@/app/actions/getCurrentUser'
import EventsClient from '@/components/AdminClient/EventsClient/EventsClient'
import React, { FC } from 'react'

const UserEventsPage: FC = async () => {
  const events = await getAllevents()
  const currentUser = await getCurrentUser()
  return (
    <>
      <EventsClient data={events.data} currentUser={currentUser['user-data']} />
    </>
  )
}

export default UserEventsPage