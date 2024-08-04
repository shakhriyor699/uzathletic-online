import { create } from "zustand";


interface IUseSportsmenModal {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
}


const useSportsmenModal = create<IUseSportsmenModal>((set) => ({
  open: false,
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}))

export default useSportsmenModal