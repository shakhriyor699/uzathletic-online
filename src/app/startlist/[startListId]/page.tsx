import { getEventById, transformData } from '@/app/actions/getEventById'
import StartListClient from '@/components/StartListClient/StartListClient'
import React, { FC } from 'react'

interface Params {
  params: {
    startListId: string
  }
}

const StartlistPage: FC<Params> = async ({ params }) => {
  const getEvent = await getEventById(params.startListId)
  const days = await transformData(params.startListId)
  return (
    <>
      <StartListClient event={getEvent} days={days} />
    </>
  )
}

export default StartlistPage