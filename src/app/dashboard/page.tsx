'use client';

import CreateBoard from '@/components/CreateBoard';
import NavBar from '@/components/NavBar';
import NoBoards from '@/components/NoBoards';
import NoColumns from '@/components/NoColumns';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { useBoards } from '@/context/BoardContext';
import { useEffect, useState } from 'react';
import ShowSidebarIcon from '@/assets/icon-show-sidebar.svg';

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openCreateBoard, setOpenCreateBoard] = useState(false);
  const [openCreateColumn, setOpenCreateColumn] = useState(false);
  const [editBoard, setEditBoard] = useState(false);
  const { boards, activeBoard, columns } = useBoards();

  useEffect(() => {
    if (!openCreateBoard) {
      setEditBoard(false);
    }
  }, [openCreateBoard]);

  return (
    <div className="w-full h-dvh relative">
      <CreateBoard
        open={openCreateBoard}
        setOpen={setOpenCreateBoard}
        editing={editBoard}
      />
      <div className="flex flex-row w-full h-full">
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          setOpenCreateBoard={setOpenCreateBoard}
        />
        <div className="flex-1 flex flex-col">
          <NavBar
            sidebarOpen={menuOpen}
            setSidebarOpen={setMenuOpen}
            setEditing={setEditBoard}
            setOpenCreateBoard={setOpenCreateBoard}
          />
          <div className="flex flex-1 w-full justify-center items-center">
            {boards.length === 0 && (
              <NoBoards setOpenCreateBoard={setOpenCreateBoard} />
            )}
            {activeBoard && columns.length < 1 && (
              <NoColumns
                setOpen={setOpenCreateBoard}
                setEditing={setEditBoard}
              />
            )}
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
      {/* )} */}
    </div>
  );
}

export default Dashboard;
