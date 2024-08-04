import { create } from "zustand";



interface IUseEventCreateModal {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
}

const useEventCreateModal = create<IUseEventCreateModal>((set) => ({
  open: false,
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}))

export default useEventCreateModal