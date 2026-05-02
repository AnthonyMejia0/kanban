import { create } from 'zustand';

type UIStore = {
  // Modals
  createBoardOpen: boolean;
  createTaskOpen: boolean;
  viewTaskOpen: boolean;
  deleteTaskOpen: boolean;
  deleteBoardOpen: boolean;

  // Sidebar
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;

  // Derived UI mode
  editingBoard: boolean;

  // setters
  setCreateBoardOpen: (v: boolean) => void;
  setCreateTaskOpen: (v: boolean) => void;
  setViewTaskOpen: (v: boolean) => void;
  setDeleteTaskOpen: (v: boolean) => void;
  setDeleteBoardOpen: (v: boolean) => void;

  setSidebarOpen: (v: boolean) => void;
  setMobileSidebarOpen: (v: boolean) => void;

  setEditingBoard: (v: boolean) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  // modals
  createBoardOpen: false,
  createTaskOpen: false,
  viewTaskOpen: false,
  deleteTaskOpen: false,
  deleteBoardOpen: false,

  // sidebar
  sidebarOpen: true,
  mobileSidebarOpen: false,

  // mode
  editingBoard: false,

  // setters
  setCreateBoardOpen: (v) =>
    set((state) => ({
      createBoardOpen: v,
      editingBoard: v ? state.editingBoard : false, // preserves your logic
    })),

  setCreateTaskOpen: (v) => set({ createTaskOpen: v }),
  setViewTaskOpen: (v) => set({ viewTaskOpen: v }),

  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),

  setEditingBoard: (v) => set({ editingBoard: v }),
  setDeleteTaskOpen: (v) => set({ deleteTaskOpen: v }),
  setDeleteBoardOpen: (v) => set({ deleteBoardOpen: v }),
}));
