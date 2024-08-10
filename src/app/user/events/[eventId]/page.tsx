import { getEventById, transformData } from '@/app/actions/getEventById'
import UserEventClient from '@/components/UserClient/UserEventClient/UserEventClient'
import React, { FC } from 'react'

interface Params {
  params: {
    eventId: string
  }
}

const Page: FC<Params> = async ({ params }) => {
  const getEvent = await getEventById(params.eventId)
  const days = await transformData(params.eventId)

  return (
    <>
      <UserEventClient event={getEvent} days={days} />
    </>
  )
}

export default Page