import { getCurrentUser } from '@/app/actions/getCurrentUser';
import { getEventRegistrationById } from '@/app/actions/getEventRegistrationById';
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

  console.log(currentUser);




  return (
    <>
      <EventRegistrationSportsmens startList={startList.sportsmen_sortables} eventRegistration={eventRegistration} currentUser={currentUser['user-data']} />
    </>
  )
}

export default Page