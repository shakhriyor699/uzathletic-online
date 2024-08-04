import { getAllRole } from '@/app/actions/getAllRoles'
import RolesClient from '@/components/AdminClient/RolesClient/RolesClient'
import React from 'react'

const RolesPage = async () => {
  const getAllRoles = await getAllRole()

  console.log(getAllRoles);
  

  return (
    <>
      <RolesClient roles={getAllRoles} />
    </>
  )
}

export default RolesPage