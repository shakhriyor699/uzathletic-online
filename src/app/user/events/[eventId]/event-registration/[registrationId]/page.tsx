import { getCurrentUser } from '@/app/actions/getCurrentUser'
import { getEventRegistrationById } from '@/app/actions/getEventRegistrationById'
import { getEventSportsmenById } from '@/app/actions/getEventSportsmenById'
import { getStartLists } from '@/app/actions/getStartList'
import UserEventRegSportsmen from '@/components/UserClient/UserEventClient/UserEventRegSportsmen/UserEventRegSportsmen'
import React, { FC } from 'react'

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
      <UserEventRegSportsmen
        eventRegistration={eventRegistration}
        startList={startList.sportsmen_sortables}
        currentUser={currentUser['user-data']}
        eventSportsmen={eventSportsmen}
      />
    </>
  )
}

export default Page