import { create } from "zustand";


interface IUseAddCountriesModal {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
}


const useAddCountriesModal = create<IUseAddCountriesModal>((set) => ({
  open: false,
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}))

const useAddCitiesModal = create<IUseAddCountriesModal>((set) => ({
  open: false,
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}))

export { useAddCountriesModal, useAddCitiesModal }