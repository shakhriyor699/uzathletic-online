import { getAllCountry } from '@/app/actions/getAllCountries'
import { getAllEventRegistrations } from '@/app/actions/getAllEventRegistration'
import { getAllGender } from '@/app/actions/getAllGenders'
import { getAllSportsmens } from '@/app/actions/getAllSportsmens'
import { getAllSportTypes } from '@/app/actions/getAllSportTypes'
import { getCurrentUser } from '@/app/actions/getCurrentUser'
import SportsmensClient from '@/components/AdminClient/SportsmensClient/SportsmensClient'
import CreateSportsmenModal from '@/components/Modals/CreateSportsmenModal'
import React from 'react'

export const revalidate = 3600

const SportsmensPage = async () => {
  const sportsmens = await getAllSportsmens()
  const genders = await getAllGender()
  const eventRegistrationTypes = await getAllEventRegistrations(100)
  const countries = await getAllCountry()
  const currentUser = await getCurrentUser()
  

  return (
    <>
      <SportsmensClient
        sportsmens={sportsmens.data}
        totalPage={sportsmens.total}
        currentUser={currentUser['user-data']}
        genders={genders}
        countries={countries}
      />
      <CreateSportsmenModal
        genders={genders}
        eventRegistrationTypes={eventRegistrationTypes}
        countries={countries}
         currentUser={currentUser['user-data']}
      />
    </>
  )
}

export default SportsmensPage