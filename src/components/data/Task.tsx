import { useBoards } from '@/context/BoardContext';
import { useDialog } from '@/context/DialogContext';
import { SubtaskType, TaskType } from '@/types/board';

type TaskProps = {
  task: TaskType;
  subtasks: SubtaskType[];
};

function Task({ task, subtasks }: TaskProps) {
  const { setCurrentTask } = useBoards();
  const { setEditTaskOpen } = useDialog();
  const completedSubtasks = subtasks.filter((subtask) => subtask.complete);

  const handleClick = () => {
    setCurrentTask(task);
    setEditTaskOpen(true);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full h-max flex flex-col justify-start items-start cursor-pointer bg-foreground rounded-lg drop-shadow-lg px-4 py-5.75"
    >
      <span className="heading-md text-primary-text">{task.title}</span>
      <span className="body-md text-secondary-text mt-2">
        {completedSubtasks.length} of {subtasks.length} subtasks
      </span>
    </button>
  );
}

export default Task;
