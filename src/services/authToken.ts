
import { cookies } from 'next/headers';


export enum EnumTokens {
  'TOKEN' = 'token',
}

export const getAccessToken =  () => {
  const accessToken =  cookies().get(EnumTokens.TOKEN)?.value
  return accessToken || null;;
}
