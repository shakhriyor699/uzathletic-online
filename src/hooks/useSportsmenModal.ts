import { ISportsman } from "@/types/sportsmanTypes";
import { create } from "zustand";


interface IUseSportsmenModal {
  open: boolean;
  id: number | null;
  sportsmanToEdit: ISportsman | null;
  handleOpen: (sportsman?: any) => void;
  handleClose: () => void;
}


const useSportsmenModal = create<IUseSportsmenModal>((set) => ({
  open: false,
  id: null,
  sportsmanToEdit: null,
  handleOpen: (sportsman = null) => set({ open: true, id: sportsman?.id, sportsmanToEdit: sportsman }),
  handleClose: () => set({ open: false, sportsmanToEdit: null }),
}))

export default useSportsmenModal