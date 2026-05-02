import { useUIStore } from '@/stores/ui-store';
import { Button } from '../ui/button';

function NoBoards() {
  const setCreateBoardOpen = useUIStore((s) => s.setCreateBoardOpen);

  return (
    <div className="flex-1 h-full flex flex-col justify-center items-center">
      <p className="text-secondary-text heading-lg text-center px-6">
        You have no boards. Create a board to get started.
      </p>
      <Button
        onClick={() => setCreateBoardOpen(true)}
        className="heading-md text-white bg-button-primary hover:bg-button-primary-hover cursor-pointer px-4.5  py-4.5 mt-8 rounded-3xl"
      >
        + Add New Board
      </Button>
    </div>
  );
}

export default NoBoards;
