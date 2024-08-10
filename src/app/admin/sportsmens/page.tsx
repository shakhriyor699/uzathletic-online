import { getAllEventRegistrations } from '@/app/actions/getAllEventRegistration'
import { getAllGender } from '@/app/actions/getAllGenders'
import { getAllSportsmens } from '@/app/actions/getAllSportsmens'
import { getAllSportTypes } from '@/app/actions/getAllSportTypes'
import SportsmensClient from '@/components/AdminClient/SportsmensClient/SportsmensClient'
import CreateSportsmenModal from '@/components/Modals/CreateSportsmenModal'
import React from 'react'

export const revalidate = 3600

const SportsmensPage = async () => {
  const sportsmens = await getAllSportsmens()
  const genders = await getAllGender()
  const eventRegistrationTypes = await getAllEventRegistrations(1)

  return (
    <>
      <SportsmensClient sportsmens={sportsmens} />
      <CreateSportsmenModal genders={genders} eventRegistrationTypes={eventRegistrationTypes} />
    </>
  )
}

export default SportsmensPage