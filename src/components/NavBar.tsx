'use client';

import { useBoards } from '@/context/BoardContext';
import VerticalEllipses from '@/assets/icon-vertical-ellipsis.svg';
import LogoMobile from '@/assets/logo-mobile.svg';
import ChevronDown from '@/assets/icon-chevron-down.svg';
import { Dispatch, SetStateAction } from 'react';

type NavBarProps = {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};

function NavBar({ menuOpen, setMenuOpen }: NavBarProps) {
  const { activeBoard } = useBoards();

  return (
    <div className="w-full md:flex-1 h-16 md:h-20 bg-foreground flex justify-between items-center px-4 md:px-6">
      <p className="hidden md:inline-block heading-lg md:heading-xl text-primary-text flex-1 mr-4">
        {activeBoard?.title ?? 'Select a board'}
      </p>
      <div className="md:hidden flex flex-row space-x-4">
        <LogoMobile />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-row items-center heading-lg md:heading-xl text-primary-text cursor-pointer"
        >
          {activeBoard?.title ?? 'Select a board'}
          <ChevronDown
            className={`ml-2 ${
              menuOpen && 'scale-y-[-1]'
            } ease-in-out duration-500`}
          />
        </button>
      </div>
      <div className="flex flex-row items-center space-x-4">
        <button
          className="hidden md:inline-block heading-md w-41 h-12 rounded-3xl text-center bg-button-primary hover:bg-button-primary-hover text-primary-text disabled:opacity-25 disabled:pointer-events-none"
          disabled={!activeBoard}
        >
          + Add New Task
        </button>
        <button
          className="md:hidden heading-md w-12 h-8 rounded-3xl text-center bg-button-primary hover:bg-button-primary-hover text-primary-text disabled:opacity-25 disabled:pointer-events-none"
          disabled={!activeBoard}
        >
          +
        </button>
        <VerticalEllipses className="cursor-pointer" />
      </div>
    </div>
  );
}

export default NavBar;
