'use client';

import VerticalEllipses from '@/assets/icon-vertical-ellipsis.svg';
import LogoMobile from '@/assets/logo-mobile.svg';
import ChevronDown from '@/assets/icon-chevron-down.svg';
import LogoDark from '@/assets/logo-dark.svg';
import LogoLight from '@/assets/logo-light.svg';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import MobileSidebar from './MobileSidebar';
import { useTheme } from 'next-themes';
import { useUIStore } from '@/stores/ui-store';
import { useNavStore } from '@/stores/nav-store';
import { useBoardStore } from '@/stores/board-store';

function NavBar() {
  const [mounted, setMounted] = useState(false);
  const boards = useBoardStore((s) => s.boards);
  const columns = useBoardStore((s) => s.columns);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const { theme } = useTheme();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);
  const setCreateBoardOpen = useUIStore((s) => s.setCreateBoardOpen);
  const setEditingBoard = useUIStore((s) => s.setEditingBoard);
  const setCreateTaskOpen = useUIStore((s) => s.setCreateTaskOpen);
  const activeBoardId = useNavStore((s) => s.activeBoardId);
  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? null;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) return;

    router.replace('/login');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;

  return (
    <div className="w-full md:flex-1 h-16 max-h-16 md:h-20 md:max-h-20 bg-foreground flex justify-between items-center px-4 md:px-6 border-b border-b-[#979797] transition-colors duration-200 ease-in-out">
      <div className="flex flex-row items-center">
        {!sidebarOpen && (
          <div>
            <div className={`${theme === 'dark' && 'hidden'} h-full ml-3 mr-8`}>
              <LogoDark />
            </div>
            <div
              className={`${theme === 'light' && 'hidden'} h-full ml-3 mr-8`}
            >
              <LogoLight />
            </div>
          </div>
        )}
        {!sidebarOpen && (
          <div className="h-16 max-h-16 md:h-20 md:max-h-20 w-px bg-[#979797]"></div>
        )}
        <p className="hidden md:inline-block heading-lg md:heading-xl text-primary-text flex-1 ml-6 mr-4">
          {activeBoard?.title ?? 'Select a board'}
        </p>
      </div>

      <MobileSidebar>
        <div className="md:hidden flex flex-row space-x-4">
          <LogoMobile />
          <div className="flex flex-row items-center heading-lg md:heading-xl text-primary-text cursor-pointer">
            {activeBoard?.title ?? 'Select a board'}
            <ChevronDown
              className={`ml-2 ${
                mobileSidebarOpen && 'scale-y-[-1]'
              } ease-in-out duration-500`}
            />
          </div>
        </div>
      </MobileSidebar>

      <div className="flex flex-row items-center space-x-4">
        <button
          onClick={() => setCreateTaskOpen(true)}
          className="hidden md:inline-block cursor-pointer heading-md w-41 h-12 rounded-3xl text-center bg-button-primary hover:bg-button-primary-hover text-white disabled:opacity-25 disabled:pointer-events-none"
          disabled={!activeBoard || columns.length === 0}
        >
          + Add New Task
        </button>
        <button
          onClick={() => setCreateTaskOpen(true)}
          className="md:hidden heading-md w-12 h-8 rounded-3xl text-center bg-button-primary hover:bg-button-primary-hover text-white disabled:opacity-25 disabled:pointer-events-none"
          disabled={!activeBoard || columns.length === 0}
        >
          +
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-max p-2">
              <VerticalEllipses className="cursor-pointer" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-foreground w-48 h-max py-4 rounded-lg mt-5"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setEditingBoard(true);
                  setCreateBoardOpen(true);
                }}
                disabled={!activeBoard}
                className="px-4 body-lg text-secondary-text hover:bg-button-secondary-hover disabled:pointer-events-none"
              >
                Edit Board
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!activeBoard}
                className="px-4 body-lg text-urgent-text hover:bg-button-secondary-hover disabled:pointer-events-none"
              >
                Delete Board
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleLogout}
                className="px-4 body-lg text-button-primary hover:bg-button-secondary-hover"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default NavBar;
