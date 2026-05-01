'use client';

import React, { Dispatch, SetStateAction, use } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import BoardIcon from '@/assets/icon-board.svg';
import LightIcon from '@/assets/icon-light-theme.svg';
import DarkIcon from '@/assets/icon-dark-theme.svg';
import { useTheme } from 'next-themes';
import { Switch } from '../ui/switch';
import { useUIStore } from '@/stores/ui-store';
import { useNavStore } from '@/stores/nav-store';
import { useBoardStore } from '@/stores/board-store';

function MobileSidebar({ children }: { children: React.ReactNode }) {
  const boards = useBoardStore((s) => s.boards);
  const setActiveBoardId = useNavStore((s) => s.setActiveBoardId);
  const { theme, setTheme } = useTheme();
  const open = useUIStore((s) => s.mobileSidebarOpen);
  const setOpen = useUIStore((s) => s.setMobileSidebarOpen);
  const setCreateBoardOpen = useUIStore((s) => s.setCreateBoardOpen);
  const activeBoardId = useNavStore((s) => s.activeBoardId);
  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? null;

  const handleChangeTheme = (checked: boolean) => {
    if (checked) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40" />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          showCloseButton={false}
          className="md:hidden top-1/4 max-w-full mx-auto w-66 px-0 py-4 rounded-lg bg-foreground shadow-lg"
        >
          <DialogHeader>
            <DialogTitle>
              <p className="px-6 text-secondary-text font-bold text-[12px] tracking-[2.4px] text-left">
                ALL BOARDS ({boards.length})
              </p>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 w-full pr-6">
            {boards.map((board) => (
              <Button
                key={board.id}
                onClick={() => {
                  setActiveBoardId(board.id);
                  setOpen(false);
                }}
                className={`flex flex-row justify-start space-x-3 pl-6 w-full h-12 cursor-pointer rounded-l-none rounded-r-full text-secondary-text hover:text-primary-text bg-none hover:bg-button-primary-hover ${
                  activeBoard === board && 'text-white bg-button-primary'
                } transition-opacity duration-75`}
              >
                <BoardIcon />
                <span className="text-inherit heading-md">{board.title}</span>
              </Button>
            ))}
            <Button
              onClick={() => setCreateBoardOpen(true)}
              className={`flex flex-row justify-start space-x-3 pl-6 w-full h-12 cursor-pointer rounded-l-none rounded-r-full text-button-primary hover:text-primary-text bg-none hover:bg-button-primary-hover`}
            >
              <BoardIcon />
              <span className="text-inherit heading-md">
                + Create New Board
              </span>
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
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MobileSidebar;
