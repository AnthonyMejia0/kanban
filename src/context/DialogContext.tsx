'use client';

import { TaskType } from '@/types/board';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

type DialogContextType = {
  createBoardOpen: boolean;
  editingBoard: boolean;
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  createTaskOpen: boolean;
  editTaskOpen: boolean;
  setCreateBoardOpen: Dispatch<SetStateAction<boolean>>;
  setEditingBoard: Dispatch<SetStateAction<boolean>>;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setCreateTaskOpen: Dispatch<SetStateAction<boolean>>;
  setEditTaskOpen: Dispatch<SetStateAction<boolean>>;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);

  useEffect(() => {
    if (!createBoardOpen) {
      setEditingBoard(false);
    }
  }, [createBoardOpen]);

  return (
    <DialogContext.Provider
      value={{
        createBoardOpen,
        setCreateBoardOpen,
        editingBoard,
        setEditingBoard,
        sidebarOpen,
        setSidebarOpen,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        createTaskOpen,
        setCreateTaskOpen,
        editTaskOpen,
        setEditTaskOpen,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }

  return context;
}
