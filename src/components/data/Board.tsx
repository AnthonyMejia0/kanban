import { useBoardStore } from '@/stores/board-store';
import Column from './Column';
import { useUIStore } from '@/stores/ui-store';
import { DragDropProvider } from '@dnd-kit/react';

function Board() {
  const tasks = useBoardStore((s) => s.tasks);
  const setTasks = useBoardStore((s) => s.setTasks);
  const columns = useBoardStore((s) => s.columns);
  const updateTaskColumn = useBoardStore((s) => s.updateTaskColumn);
  const setCreateBoardOpen = useUIStore((s) => s.setCreateBoardOpen);
  const setEditingBoard = useUIStore((s) => s.setEditingBoard);

  return (
    <div className="w-full min-w-max h-full flex gap-6 p-6 overflow-x-auto overflow-y-hidden">
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled || !event.operation.target) return;
          const { source, target } = event.operation;

          if (!source || !target) return;

          const sourceTask = tasks.find((t) => t.id === source.id);
          const targetColumn = columns.find((c) => c.id === target.id);

          if (sourceTask && targetColumn) {
            setTasks(
              tasks.map((task) =>
                task.id === sourceTask.id
                  ? { ...task, column_id: targetColumn.id }
                  : task,
              ),
            );

            updateTaskColumn(sourceTask.id, targetColumn.id);
          }
        }}
      >
        {columns.map((column, i) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
          />
        ))}
      </DragDropProvider>
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
