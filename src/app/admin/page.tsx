
import { redirect } from 'next/navigation'
import React from 'react'


const Page = async () => {

  redirect('/admin/events')


  return (
    <div >
    </div>
  )
}

export default Page