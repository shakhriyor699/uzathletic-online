import { getAllRole } from '@/app/actions/getAllRoles'
import { getUsers } from '@/app/actions/getAllUsers'
import { getCurrentUser } from '@/app/actions/getCurrentUser'
import UsersClient from '@/components/AdminClient/UsersClient/UsersClient'
import CreateUserModal from '@/components/Modals/CreateUserModal'
import React from 'react'


const AdminUsersPage = async () => {
  const users = await getUsers()
  const roles = await getAllRole()
  const currentUser = await getCurrentUser()

  return (
    <>
      <UsersClient
        users={users}
      />
      <CreateUserModal roles={roles} />
    </>
  )
}

export default AdminUsersPage