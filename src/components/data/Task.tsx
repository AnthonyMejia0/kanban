import { useNavStore } from '@/stores/nav-store';
import { useUIStore } from '@/stores/ui-store';
import { SubtaskType, TaskType } from '@/types/board';
import { useDraggable } from '@dnd-kit/react';

type TaskProps = {
  task: TaskType;
  subtasks: SubtaskType[];
  index: number;
};

function Task({ task, subtasks, index }: TaskProps) {
  const setSelectedTaskId = useNavStore((s) => s.setSelectedTaskId);
  const setViewTaskOpen = useUIStore((s) => s.setViewTaskOpen);
  const filteredSubtasks = subtasks.filter(
    (subtask) => subtask.task_id === task.id,
  );
  const completedSubtasks = filteredSubtasks.filter(
    (subtask) => subtask.complete,
  );

  const { ref: sortableRef } = useDraggable({
    id: task.id,
  });

  const handleClick = () => {
    setSelectedTaskId(task.id);
    setViewTaskOpen(true);
  };

  return (
    <button
      ref={sortableRef}
      onClick={handleClick}
      className="w-full h-max flex flex-col justify-start items-start cursor-pointer bg-foreground hover:opacity-70 rounded-lg drop-shadow-lg px-4 py-5.75"
    >
      <span className="heading-md text-primary-text text-left">
        {task.title}
      </span>
      {filteredSubtasks.length > 0 && (
        <span className="body-md text-secondary-text mt-2">
          {completedSubtasks.length} of {filteredSubtasks.length} subtasks
        </span>
      )}
    </button>
  );
}

export default Task;
