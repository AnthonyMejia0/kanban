import { useBoardStore } from '@/stores/board-store';
import Column from './Column';
import { useUIStore } from '@/stores/ui-store';

function Board() {
  const columns = useBoardStore((s) => s.columns);
  const setCreateBoardOpen = useUIStore((s) => s.setCreateBoardOpen);
  const setEditingBoard = useUIStore((s) => s.setEditingBoard);

  return (
    <div className="w-full h-full flex flex-row gap-6 p-6 overflow-x-scroll overflow-y-hidden">
      {columns.map((column, i) => (
        <Column key={i} id={column.id} title={column.title} />
      ))}
      <button
        onClick={() => {
          setEditingBoard(true);
          setCreateBoardOpen(true);
        }}
        className="cursor-pointer heading-xl text-secondary-text hover:text-button-primary h-full w-70 flex justify-center items-center bg-linear-to-b from-new-column to-new-column/50 rounded-md"
      >
        + New Column
      </button>
    </div>
  );
}

export default Board;
