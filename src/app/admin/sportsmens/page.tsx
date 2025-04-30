import { getAllCities } from '@/app/actions/getAllCities'
import { getAllCountry } from '@/app/actions/getAllCountries'
import { getAllEventRegistrations } from '@/app/actions/getAllEventRegistration'
import { getAllGender } from '@/app/actions/getAllGenders'
import { getAllSportsmens } from '@/app/actions/getAllSportsmens'
import { getAllSportTypes } from '@/app/actions/getAllSportTypes'
import { getCurrentUser } from '@/app/actions/getCurrentUser'
import SportsmensClient from '@/components/AdminClient/SportsmensClient/SportsmensClient'
import AddCountriesModal from '@/components/Modals/AddCountriesModal'
import CreateSportsmenModal from '@/components/Modals/CreateSportsmenModal'
import React from 'react'

export const revalidate = 3600

const SportsmensPage = async () => {
  const sportsmens = await getAllSportsmens()
  const genders = await getAllGender()
  const eventRegistrationTypes = await getAllEventRegistrations(1)
  const sportTypes = await getAllSportTypes(80)
  const countries = await getAllCountry()
  const currentUser = await getCurrentUser()
  const cities = await getAllCities()
  const getAllCountries = await getAllCountry()

  return (
    <>
      <SportsmensClient
        totalPage={sportsmens.total}
        sportsmens={sportsmens.data}
        currentUser={currentUser['user-data']}
        genders={genders}
        cities={cities.data}
        sportTypes={sportTypes}
      />
      <CreateSportsmenModal
        genders={genders}
        eventRegistrationTypes={eventRegistrationTypes}
        countries={countries}
        currentUser={currentUser['user-data']}
      />
      <AddCountriesModal countries={getAllCountries} />
    </>
  )
}

export default SportsmensPage