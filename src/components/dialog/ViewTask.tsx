'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Toggle } from '../ui/toggle';
import { Field, FieldGroup } from '../ui/field';
import { useUIStore } from '@/stores/ui-store';
import { useNavStore } from '@/stores/nav-store';
import { useBoardStore } from '@/stores/board-store';
import CheckIcon from '@/assets/icon-check.svg';
import VerticalEllipses from '@/assets/icon-vertical-ellipsis.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function ViewTask() {
  const columns = useBoardStore((s) => s.columns);
  const tasks = useBoardStore((s) => s.tasks);
  const subtasks = useBoardStore((s) => s.subtasks);
  const toggleSubtask = useBoardStore((s) => s.toggleSubtask);
  const updateTaskColumn = useBoardStore((s) => s.updateTaskColumn);
  const viewTaskOpen = useUIStore((s) => s.viewTaskOpen);
  const setViewTaskOpen = useUIStore((s) => s.setViewTaskOpen);
  const setDeleteTaskOpen = useUIStore((s) => s.setDeleteTaskOpen);
  const selectedTaskId = useNavStore((s) => s.selectedTaskId);
  const setSelectedTaskId = useNavStore((s) => s.setSelectedTaskId);
  const currentTask = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const filteredSubtasks = subtasks.filter(
    (subtask) => subtask.task_id === currentTask?.id,
  );
  const completedSubtasks = filteredSubtasks.filter(
    (subtask) => subtask.complete,
  );
  const currentColumn = columns.find(
    (column) => column.id === currentTask?.column_id,
  );

  const handleToggle = async (
    currentCompletion: boolean,
    subtaskId: string,
  ) => {
    await toggleSubtask(currentCompletion, subtaskId);
  };

  const handleUpdateColumn = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const column = columns.find((c) => c.title === e.target.value) || null;

    if (!column || !currentTask) return;

    setViewTaskOpen(false);
    await updateTaskColumn(currentTask.id, column.id);
  };

  return (
    <Dialog open={viewTaskOpen} onOpenChange={setViewTaskOpen}>
      <DialogContent className="bg-foreground p-8" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-primary-text heading-lg flex flex-row items-center justify-between gap-6">
            <p className="text-inherit heading-xl flex-1">
              {currentTask?.title}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-max p-2 cursor-pointer">
                  <VerticalEllipses className="cursor-pointer" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-foreground w-48 h-max py-4 rounded-lg mt-5"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer px-4 body-lg text-secondary-text hover:bg-button-secondary-hover disabled:pointer-events-none">
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setViewTaskOpen(false);
                      setDeleteTaskOpen(true);
                    }}
                    className="cursor-pointer px-4 body-lg text-urgent-text hover:bg-button-secondary-hover disabled:pointer-events-none"
                  >
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogTitle>

          {currentTask?.description && (
            <p className="text-secondary-text body-lg mt-4">
              {currentTask?.description}
            </p>
          )}
        </DialogHeader>

        <FieldGroup>
          <Field>
            {filteredSubtasks.length > 0 && (
              <p className="body-md text-secondary-text mt-2 mb-2">
                Subtasks ({completedSubtasks.length} of{' '}
                {filteredSubtasks.length})
              </p>
            )}

            {subtasks
              .filter((subtask) => subtask.task_id === currentTask?.id)
              .sort((a, b) => a.position - b.position)
              .map((subtask) => (
                <Toggle
                  key={subtask.id}
                  aria-label="Toggle subtask"
                  size="sm"
                  variant="default"
                  onPressedChange={() =>
                    handleToggle(subtask.complete, subtask.id)
                  }
                  className="cursor-pointer disabled:pointer-events-none w-full h-max rounded bg-subtask hover:bg-button-secondary-hover flex flex-row justify-start items-center gap-4 p-3"
                  pressed={subtask.complete}
                >
                  <div
                    className={`w-4 h-4 flex justify-center items-center rounded-xs ${subtask.complete ? 'bg-button-primary' : 'bg-white'}`}
                  >
                    {subtask.complete && (
                      <CheckIcon className="max-w-3 max-h-3 text-white" />
                    )}
                  </div>
                  <p
                    className={`body-md text-secondary-text ${
                      subtask.complete && 'line-through'
                    }`}
                  >
                    {subtask.title}
                  </p>
                </Toggle>
              ))}

            <label
              htmlFor="status"
              className="body-md text-secondary-text mt-4"
            >
              Current Status
            </label>

            <select
              name="status"
              id="status"
              value={currentColumn?.title || ''}
              onChange={handleUpdateColumn}
              className="cursor-pointer border border-[#828FA3] focus:border-button-primary px-4 py-2 rounded-sm w-full disabled:opacity-50"
            >
              {columns.map((column) => (
                <option key={column.id} value={column.title}>
                  {column.title}
                </option>
              ))}
            </select>
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}

export default ViewTask;
