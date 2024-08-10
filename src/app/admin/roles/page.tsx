import { getAllRole } from '@/app/actions/getAllRoles'
import RolesClient from '@/components/AdminClient/RolesClient/RolesClient'
import React from 'react'

export const revalidate = 3600

const RolesPage = async () => {
  const getAllRoles = await getAllRole()

  

  return (
    <>
      <RolesClient roles={getAllRoles} />
    </>
  )
}

export default RolesPage