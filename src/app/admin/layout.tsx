import AdminClient from "@/components/AdminClient/AdminClient"
import { FC } from "react"
import { getCurrentUser } from "../actions/getCurrentUser"
import './admin.scss';



interface LayoutProps {
  children: React.ReactNode
}

export const revalidate = 3600

const AdminLayout: FC<LayoutProps> = async ({ children }) => {
  const currentUser = await getCurrentUser()

  return (
    <div className='admin flex items-start gap-40'>
      <AdminClient currentUser={currentUser['user-data']} >{children}</AdminClient>
    </div>
  )
}

export default AdminLayout