
import { FC } from "react"
import { getCurrentUser } from "../actions/getCurrentUser"
import UserClient from "@/components/UserClient/UserClient"


interface LayoutProps {
  children: React.ReactNode
}

const UserLayout: FC<LayoutProps> = async ({ children }) => {
  const currentUser = await getCurrentUser()

  return (
    <div className='flex items-start gap-40'>
      <UserClient currentUser={currentUser['user-data']}>{children}</UserClient>
    </div>
  )
}

export default UserLayout