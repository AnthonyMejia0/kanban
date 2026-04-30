'use client';

import { useDialog } from '@/context/DialogContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useBoards } from '@/context/BoardContext';
import { Toggle } from '../ui/toggle';
import { Field, FieldGroup } from '../ui/field';

function EditTask() {
  const { columns, currentTask, subtasks, toggleSubtask, updateTaskColumn } =
    useBoards();
  const { editTaskOpen, setEditTaskOpen } = useDialog();
  const completedSubtasks = subtasks.filter((subtask) => subtask.complete);
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

    await updateTaskColumn(currentTask.id, column.id);
  };

  return (
    <Dialog open={editTaskOpen} onOpenChange={setEditTaskOpen}>
      <DialogContent className="bg-foreground p-8" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-primary-text heading-lg">
            {currentTask?.title}
          </DialogTitle>

          <DialogDescription className="text-secondary-text body-lg mt-4">
            {currentTask?.description}
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <p className="body-md text-secondary-text mt-2 mb-2">
              Subtasks ({completedSubtasks.length} of {subtasks.length})
            </p>

            {subtasks
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
                  className="cursor-pointer disabled:pointer-events-none mt-2 w-full h-max rounded bg-subtask flex flex-row justify-start items-center gap-4 p-3"
                  pressed={subtask.complete}
                >
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
              className="cursor-pointer border border-[#828FA3] px-4 py-2 rounded-sm w-full disabled:opacity-50"
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

export default EditTask;
