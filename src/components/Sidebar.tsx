'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import LogoLight from '@/assets/logo-light.svg';
import LogoDark from '@/assets/logo-dark.svg';
import BoardIcon from '@/assets/icon-board.svg';
import LightIcon from '@/assets/icon-light-theme.svg';
import DarkIcon from '@/assets/icon-dark-theme.svg';
import HideSidebaricon from '@/assets/icon-hide-sidebar.svg';
import { useTheme } from 'next-themes';
import { useBoards } from '@/context/BoardContext';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

type SidebarProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOpenCreateBoard: Dispatch<SetStateAction<boolean>>;
};

function Sidebar({ open, setOpen, setOpenCreateBoard }: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  const { boards, activeBoard, selectBoard } = useBoards();
  const { theme, setTheme } = useTheme();

  const handleChangeTheme = (checked: boolean) => {
    if (checked) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`hidden md:flex flex-col h-screen z-5 ${
        open ? 'md:w-65.25 lg:w-75' : 'w-0'
      } py-8 bg-foreground border-r border-r-[#979797] transition-[width] duration-200 ease-in-out`}
    >
      <div
        className={`w-full h-full flex flex-col ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className={`${theme === 'light' && 'hidden'} ml-6.5 lg:ml-8.25`}>
          <LogoLight />
        </div>
        <div className={`${theme === 'dark' && 'hidden'} ml-6.5 lg:ml-8.25`}>
          <LogoDark />
        </div>

        <p
          className={`heading-sm tracking-[2.4px] text-secondary-text ml-6 lg:ml-8 mt-13.5`}
        >
          ALL BOARDS ({boards.length})
        </p>

        <div className="flex-1 w-full mt-4.75 pr-6">
          {boards.map((board) => (
            <Button
              key={board.id}
              onClick={() => selectBoard(board)}
              className={`flex flex-row justify-start space-x-3 pl-8 w-full h-12 cursor-pointer rounded-l-none rounded-r-full text-secondary-text hover:text-button-primary bg-none hover:bg-button-secondary-hover ${
                activeBoard === board && 'text-white bg-button-primary'
              } transition-opacity duration-75`}
            >
              <BoardIcon />
              <span className="text-inherit heading-md">{board.title}</span>
            </Button>
          ))}
          <Button
            onClick={() => setOpenCreateBoard(true)}
            className={`flex flex-row justify-start space-x-3 pl-8 w-full h-12 cursor-pointer rounded-l-none rounded-r-full text-button-primary bg-none hover:bg-button-secondary-hover`}
          >
            <BoardIcon />
            <span className="text-inherit heading-md">+ Create New Board</span>
          </Button>
        </div>
        <div className="w-full px-6 h-12">
          <div className="w-full h-full bg-background rounded-md flex flex-row space-x-6 items-center justify-center">
            <LightIcon />
            <Switch
              id="theme"
              className="cursor-pointer bg-button-primary hover:bg-button-primary-hover"
              checked={theme === 'dark'}
              onCheckedChange={handleChangeTheme}
            />
            <DarkIcon />
          </div>
        </div>
        <div className="w-full pr-6">
          <Button
            onClick={() => setOpen(false)}
            className={`flex flex-row justify-start mt-2 space-x-3 pl-8 w-full h-12 cursor-pointer rounded-l-none rounded-r-full text-secondary-text hover:text-button-primary bg-none hover:bg-white`}
          >
            <HideSidebaricon />
            <span className="text-inherit heading-md">Hide Sidebar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
