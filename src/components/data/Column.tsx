import { useBoardStore } from '@/stores/board-store';
import Task from './Task';
import { useDroppable } from '@dnd-kit/react';

type ColumnProps = {
  id: string;
  title: string;
};

function Column({ id, title }: ColumnProps) {
  const tasks = useBoardStore((s) => s.tasks);
  const subtasks = useBoardStore((s) => s.subtasks);
  const filteredTasks = tasks.filter((task) => task.column_id === id);

  const { isDropTarget, ref: droppableRef } = useDroppable({
    id,
  });

  return (
    <div className="h-full w-70 rounded-md">
      <div className="flex flex-row gap-3 items-center mb-6">
        <div className="bg-green-500 w-3.75 h-3.75 rounded-full"></div>
        <p className="text-secondary-text heading-sm">
          {title} ({filteredTasks.length})
        </p>
      </div>

      <ul
        ref={droppableRef}
        className={`w-full flex flex-col space-y-5 h-full min-h-10 overflow-y-scroll ${isDropTarget && 'bg-new-column/50'}`}
      >
        {tasks
          .filter((task) => task.column_id === id)
          .map((task, i) => (
            <Task key={task.id} task={task} subtasks={subtasks} index={i} />
          ))}
      </ul>
    </div>
  );
}

export default Column;
