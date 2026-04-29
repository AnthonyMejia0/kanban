'use client';

import CreateBoard from '@/components/dialog/CreateBoard';
import NavBar from '@/components/nav/NavBar';
import NoBoards from '@/components/empty/NoBoards';
import NoColumns from '@/components/empty/NoColumns';
import Sidebar from '@/components/nav/Sidebar';
import { Button } from '@/components/ui/button';
import { useBoards } from '@/context/BoardContext';
import { useEffect } from 'react';
import ShowSidebarIcon from '@/assets/icon-show-sidebar.svg';
import { useDialog } from '@/context/DialogContext';

function Dashboard() {
  const { boards, activeBoard, columns } = useBoards();
  const { createBoardOpen, setEditingBoard, sidebarOpen, setSidebarOpen } =
    useDialog();

  useEffect(() => {
    if (!createBoardOpen) {
      setEditingBoard(false);
    }
  }, [createBoardOpen]);

  return (
    <div className="w-full h-dvh relative">
      <CreateBoard />
      <div className="flex flex-row w-full h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <NavBar />
          <div className="flex flex-1 w-full justify-center items-center">
            {boards.length === 0 && <NoBoards />}
            {activeBoard && columns.length < 1 && <NoColumns />}
          </div>
        </div>
      </div>

      <Button
        onClick={() => setSidebarOpen(true)}
        className={`hidden absolute md:flex flex-row items-center justify-center bottom-8 left-0 w-14 cursor-pointer h-12 rounded-l-none rounded-r-full bg-button-primary hover:bg-button-primary-hover text-primary-text transition-opacity duration-500 ease-in-out
    ${!sidebarOpen ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
      >
        <ShowSidebarIcon className="mt-1.5" />
      </Button>
    </div>
  );
}

export default Dashboard;
