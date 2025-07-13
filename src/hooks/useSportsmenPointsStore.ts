// stores/useSportsmenPointsStore.ts
import { create } from 'zustand';

type PointsActions = {
  append: (val: any) => void;
  remove: (index: number) => void;
};

type Store = {
  set: (id: number, actions: PointsActions) => void;
  get: (id: number) => PointsActions | undefined;
  clear: () => void;
  store: Record<number, PointsActions>;
};

export const useSportsmenPointsStore = create<Store>((set, get) => ({
  store: {},
  set: (id, actions) =>
    set((state) => ({ store: { ...state.store, [id]: actions } })),
  get: (id) => get().store[id],
  clear: () => set({ store: {} }),
}));
