
import { IAuthForm } from '@/types/authTypes'
import axios from 'axios'
import { create } from 'zustand'


const useUser = create((set) => ({
  user: null,
  setUser: (user: any) => set({ user }),
  logout: () => set({ user: null }),
}))

export default useUser