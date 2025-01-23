import { create } from "zustand";


interface IUseEventRegistrationCreateModal {
  open: boolean
  id: string | null
  handleOpen: (id: string | null) => void
  handleClose: () => void
}



const useEventRegistrationCreateModal = create<IUseEventRegistrationCreateModal>((set) => ({
  open: false,
  id: null,
  handleOpen: (id: string | null = null) => set({ open: true, id }),
  handleClose: () => set({ open: false }),
}))

export default useEventRegistrationCreateModal