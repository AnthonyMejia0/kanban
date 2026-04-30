import { useBoards } from '@/context/BoardContext';
import Task from './Task';

type ColumnProps = {
  id: string;
  title: string;
};

function Column({ id, title }: ColumnProps) {
  const { tasks, subtasks } = useBoards();

  return (
    <div className="h-full w-70 overflow-y-scroll rounded-md">
      <div className="flex flex-row gap-3 items-center mb-6">
        <div className="bg-green-500 w-3.75 h-3.75 rounded-full"></div>
        <p className="text-secondary-text heading-sm">{title}</p>
      </div>
      {tasks
        .filter((task) => task.column_id === id)
        .map((task) => (
          <Task key={task.id} task={task} subtasks={subtasks} />
        ))}
    </div>
  );
}

export default Column;
