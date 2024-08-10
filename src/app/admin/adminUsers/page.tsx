import { getAllRole } from '@/app/actions/getAllRoles'
import { getUsers } from '@/app/actions/getAllUsers'
import UsersClient from '@/components/AdminClient/UsersClient/UsersClient'
import CreateUserModal from '@/components/Modals/CreateUserModal'
import React from 'react'

export const revalidate = 3600

const AdminUsersPage = async () => {
  const users = await getUsers()
  const roles = await getAllRole()

  return (
    <>
      <UsersClient users={users} />
      <CreateUserModal roles={roles} />
    </>
  )
}

export default AdminUsersPage