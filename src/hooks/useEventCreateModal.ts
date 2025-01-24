import { create } from "zustand";



interface IUseEventCreateModal {
  open: boolean
  id: number | null
  handleOpen: (id?: number | null) => void
  handleClose: () => void
}

const useEventCreateModal = create<IUseEventCreateModal>((set) => ({
  open: false,
  id: null,
  handleOpen: (id: number | null = null) => set({ open: true, id }),
  handleClose: () => set({ open: false }),
}))

export default useEventCreateModal