import { getAllEventSportsmen } from '@/app/actions/getAllEventSpotsmen';
import { getCurrentUser } from '@/app/actions/getCurrentUser';
import { getEventRegistrationById } from '@/app/actions/getEventRegistrationById';
import { getEventSportsmenById } from '@/app/actions/getEventSportsmenById';
import { getStartLists } from '@/app/actions/getStartList';
import EventRegistrationSportsmens from '@/components/AdminClient/EventsClient/EventRegistration/EventRegistrationSportsmens/EventRegistrationSportsmens';
import React, { FC } from 'react'

export const revalidate = 3600

interface Params {
  params: {
    registrationId: string
  }
}

const Page: FC<Params> = async ({ params }) => {
  const eventRegistration = await getEventRegistrationById(params.registrationId)
  const startList = await getStartLists(params.registrationId)
  const currentUser = await getCurrentUser()
  const eventSportsmen = await getEventSportsmenById(params.registrationId)


 


  return (
    <>
      <EventRegistrationSportsmens
        startList={startList.sportsmen_sortables}
        eventRegistration={eventRegistration}
        currentUser={currentUser['user-data']}
        eventSportsmen={eventSportsmen}
      />
    </>
  )
}

export default Page