import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button } from './ui/button';

type NoColumnsProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setEditing: Dispatch<SetStateAction<boolean>>;
};

function NoColumns({ setOpen, setEditing }: NoColumnsProps) {
  return (
    <div className="flex-1 h-full flex flex-col justify-center items-center">
      <p className="text-secondary-text heading-lg text-center px-6">
        This board is empty. Create a new column to get started.
      </p>
      <Button
        onClick={() => {
          setEditing(true);
          setOpen(true);
        }}
        className="heading-md text-white bg-button-primary hover:bg-button-primary-hover cursor-pointer px-4.5  py-4.5 mt-8 rounded-3xl"
      >
        + Add New Column
      </Button>
    </div>
  );
}

export default NoColumns;
