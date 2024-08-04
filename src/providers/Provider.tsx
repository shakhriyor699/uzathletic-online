'use client'
import { cookies } from 'next/headers';
import React, { FC } from 'react'

interface IProvider {
  value: string | undefined
  children: React.ReactNode
}


const Provider: FC<IProvider> = ({ value, children }) => {
  const Context = React.createContext(value)

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider >
  )
}

export default Provider