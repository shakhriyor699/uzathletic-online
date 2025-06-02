import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"


export const getCurrentUser = async () => {
  const cookie = cookies().get('token')
  const token = cookie?.value
  ;
  
  if (token) {
    const decoded = jwtDecode(token) as any

    return decoded
  }
}