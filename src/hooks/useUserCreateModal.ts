import { create } from "zustand";



interface IUseUserCreateModal {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
}

const useEventCreateModal = create<IUseUserCreateModal>((set) => ({
  open: false,
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}))

export default useEventCreateModal