import { getAllCountry } from '@/app/actions/getAllCountries'
import { getAllevents } from '@/app/actions/getAllevents'
import { getCurrentUser } from '@/app/actions/getCurrentUser'
import ArchiveClient from '@/components/AdminClient/ArchiveClient/ArchiveClient'
import React from 'react'

export const revalidate = 3600

const Page = async () => {
  const events = await getAllevents()
  const currentUser = await getCurrentUser()

  return (
    <>
      <ArchiveClient data={events.data} currentUser={currentUser['user-data']} />
    </>
  )
}

export default Page