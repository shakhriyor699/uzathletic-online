import React, { FC } from 'react'
import { redirect } from 'next/navigation'

const Page: FC = () => {
  redirect('/user/events')
  return (
    <div></div>
  )
}

export default Page