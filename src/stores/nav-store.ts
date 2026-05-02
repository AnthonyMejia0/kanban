import { create } from 'zustand';

type NavStore = {
  activeBoardId: string | null;
  selectedTaskId: string | null;

  setActiveBoardId: (id: string | null) => void;
  setSelectedTaskId: (id: string | null) => void;
};

export const useNavStore = create<NavStore>((set) => ({
  activeBoardId: null,
  selectedTaskId: null,

  setActiveBoardId: (id) => set({ activeBoardId: id }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
}));
