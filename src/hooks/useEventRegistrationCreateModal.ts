import { create } from "zustand";


interface IUseEventRegistrationCreateModal {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
}



const useEventRegistrationCreateModal = create<IUseEventRegistrationCreateModal>((set) => ({
  open: false,
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}))

export default useEventRegistrationCreateModal