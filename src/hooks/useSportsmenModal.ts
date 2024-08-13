import { ISportsman } from "@/types/sportsmanTypes";
import { create } from "zustand";


interface IUseSportsmenModal {
  open: boolean;
  isEdit: boolean;
  sportsmanToEdit: ISportsman | null;
  handleOpen: (sportsman?: any) => void;
  handleClose: () => void;
}


const useSportsmenModal = create<IUseSportsmenModal>((set) => ({
  open: false,
  isEdit: false,
  sportsmanToEdit: null,
  handleOpen: (sportsman = null) => set({ open: true, isEdit: !!sportsman, sportsmanToEdit: sportsman }),
  handleClose: () => set({ open: false, isEdit: false, sportsmanToEdit: null }),
}))

export default useSportsmenModal