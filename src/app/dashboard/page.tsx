'use client';

import NavBar from '@/components/nav/NavBar';
import NoBoards from '@/components/empty/NoBoards';
import NoColumns from '@/components/empty/NoColumns';
import Sidebar from '@/components/nav/Sidebar';
import { Button } from '@/components/ui/button';
import ShowSidebarIcon from '@/assets/icon-show-sidebar.svg';
import DialogContainer from '@/components/dialog/DialogContainer';
import Board from '@/components/data/Board';
import { useUIStore } from '@/stores/ui-store';
import { useNavStore } from '@/stores/nav-store';
import { useBoardStore } from '@/stores/board-store';
import { useEffect } from 'react';

function Dashboard() {
  const boards = useBoardStore((s) => s.boards);
  const columns = useBoardStore((s) => s.columns);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const activeBoardId = useNavStore((s) => s.activeBoardId);
  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? null;
  const setActiveBoardId = useNavStore((s) => s.setActiveBoardId);
  const loadBoards = useBoardStore((s) => s.loadBoards);
  const loadBoard = useBoardStore((s) => s.loadBoard);

  useEffect(() => {
    console.log('Boards effect...');
    if (boards.length === 0) {
      setActiveBoardId(null);
      return;
    }

    // No active board yet → select first
    if (!activeBoard) {
      setActiveBoardId(boards[0].id);
      return;
    }

    // Sync updated board data
    const updatedBoard = boards.find((board) => board.id === activeBoard.id);

    if (updatedBoard) {
      setActiveBoardId(updatedBoard.id);
    }
  }, [boards]);

  useEffect(() => {
    console.log('Active board id: ', activeBoardId);
    if (!activeBoard) return;
    loadBoard(activeBoard.id);
  }, [activeBoard]);

  useEffect(() => {
    console.log('Loading boards on mount...');
    loadBoards();
  }, [loadBoards]);

  return (
    <div className="w-full h-dvh relative">
      <DialogContainer />

      <div className="flex flex-row w-full h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <NavBar />
          <div className="flex flex-1 w-full justify-center items-center">
            {boards.length === 0 && <NoBoards />}
            {activeBoard && columns.length < 1 && <NoColumns />}
            {activeBoard && columns.length > 0 && <Board />}
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
