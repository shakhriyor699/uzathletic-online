import { getEventRegistrationById } from '@/app/actions/getEventRegistrationById'
import { getEventSportsmenById } from '@/app/actions/getEventSportsmenById'
import { getStartLists } from '@/app/actions/getStartList'
import EventRegistrationSportsmens from '@/components/AdminClient/EventsClient/EventRegistration/EventRegistrationSportsmens/EventRegistrationSportsmens'
import { Button } from '@mui/material'
import { House } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'


interface Params {
  params: {
    registrationId: string
  }
}

const RegistrationIdPage: FC<Params> = async ({ params }) => {
  const eventRegistration = await getEventRegistrationById(params.registrationId)
  const startList = await getStartLists(params.registrationId)
  const eventSportsmen = await getEventSportsmenById(params.registrationId)



  return (
    <>
      <Button>
        <Link href='/' className='flex items-center gap-3 my-5'>
          <House />
          На главную
        </Link>
      </Button>
      <EventRegistrationSportsmens startList={startList.sportsmen_sortables} eventRegistration={eventRegistration} eventSportsmen={eventSportsmen} />
    </>
  )
}

export default RegistrationIdPage