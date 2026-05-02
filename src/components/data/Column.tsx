import { useBoardStore } from '@/stores/board-store';
import Task from './Task';

type ColumnProps = {
  id: string;
  title: string;
};

function Column({ id, title }: ColumnProps) {
  const tasks = useBoardStore((s) => s.tasks);
  const subtasks = useBoardStore((s) => s.subtasks);
  const filteredTasks = tasks.filter((task) => task.column_id === id);

  return (
    <div className="h-full w-70 rounded-md">
      <div className="flex flex-row gap-3 items-center mb-6">
        <div className="bg-green-500 w-3.75 h-3.75 rounded-full"></div>
        <p className="text-secondary-text heading-sm">
          {title} ({filteredTasks.length})
        </p>
      </div>
      <div className="w-full flex flex-col space-y-5 h-full overflow-y-scroll">
        {tasks
          .filter((task) => task.column_id === id)
          .map((task) => (
            <Task key={task.id} task={task} subtasks={subtasks} />
          ))}
      </div>
    </div>
  );
}

export default Column;
