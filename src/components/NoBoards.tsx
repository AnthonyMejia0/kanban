import React, { Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';

type NoBoardsProps = {
  setOpenCreateBoard: Dispatch<SetStateAction<boolean>>;
};

function NoBoards({ setOpenCreateBoard }: NoBoardsProps) {
  return (
    <div className="flex-1 h-full flex flex-col justify-center items-center">
      <p className="text-secondary-text heading-lg text-center px-6">
        You have no boards. Create a board to get started.
      </p>
      <Button
        onClick={() => setOpenCreateBoard(true)}
        className="heading-md bg-button-primary hover:bg-button-primary-hover cursor-pointer px-4.5  py-4.5 mt-8 rounded-3xl"
      >
        + Add New Board
      </Button>
    </div>
  );
}

export default NoBoards;
