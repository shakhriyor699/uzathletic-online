import { create } from "zustand";


interface IUseEventProceduresModal {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
}



const useEventProceduresModal = create<IUseEventProceduresModal>((set) => ({
  open: false,
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}))

export default useEventProceduresModal