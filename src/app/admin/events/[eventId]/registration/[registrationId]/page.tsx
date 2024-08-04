import { getEventRegistrationById } from '@/app/actions/getEventRegistrationById';
import EventRegistrationSportsmens from '@/components/AdminClient/EventsClient/EventRegistration/EventRegistrationSportsmens/EventRegistrationSportsmens';
import React, { FC } from 'react'

interface Params {
  params: {
    registrationId: string
  }
}

const Page: FC<Params> = async ({ params }) => {
  const eventRegistration = await getEventRegistrationById(params.registrationId)

  console.log(eventRegistration.sportsmen);
  
  return (
    <>
      <EventRegistrationSportsmens eventRegistration={eventRegistration} />
    </>
  )
}

export default Page