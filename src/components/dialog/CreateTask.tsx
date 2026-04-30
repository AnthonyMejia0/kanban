import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Field, FieldGroup } from '../ui/field';
import { Button } from '../ui/button';
import { useDialog } from '@/context/DialogContext';
import React, { useState } from 'react';
import { Spinner } from '../ui/spinner';
import CloseIcon from '@/assets/icon-cross.svg';
import { useBoards } from '@/context/BoardContext';
import { toast } from 'sonner';
import { ColumnType } from '@/types/board';

const descriptionPlaceholder =
  "e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little.";

function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [column, setColumn] = useState<ColumnType | null>(null);
  const { createTaskOpen, setCreateTaskOpen } = useDialog();
  const { columns, createTask } = useBoards();

  const handleChangeColumn = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColumn(columns.find((c) => c.title === e.target.value) || null);
  };

  const handleCreateTask = async () => {
    if (!title.trim()) {
      toast.error('Task title cannot be empty.');
      return;
    }

    if (!column) {
      toast.error('Please select a column.');
      return;
    }

    setLoading(true);

    const success = await createTask(title, description, subtasks, column.id);

    if (!success) {
      toast.error('Failed to create task.');
      return;
    }

    toast.success('Task created successfully.');
    setLoading(false);
    setCreateTaskOpen(false);
  };

  return (
    <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
      <DialogContent className="bg-foreground p-8" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-primary-text heading-lg">
            Add New Task
          </DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <label htmlFor="title" className="body-md text-secondary-text">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Web Design"
              className="border border-[#828FA3] px-4 py-2 rounded-sm"
            />

            <label
              htmlFor="description"
              className="body-md text-secondary-text"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={descriptionPlaceholder}
              className="border border-[#828FA3] px-4 py-2 rounded-sm resize-none h-28"
            />
            {subtasks.length > 0 && (
              <p className="body-md text-secondary-text">Subtasks</p>
            )}
            {subtasks.map((s, index) => (
              <div key={index} className="w-full flex flex-row items-center">
                <input
                  type="text"
                  name="subtask"
                  value={s}
                  onChange={(e) => {
                    const newSubtasks = [...subtasks];
                    newSubtasks[index] = e.target.value;
                    setSubtasks(newSubtasks);
                  }}
                  className="border border-[#828FA3] px-4 py-2 rounded-sm flex-1"
                  placeholder="e.g. Research"
                />
                <Button
                  onClick={() => {
                    const newSubtasks = [...subtasks];
                    newSubtasks.splice(index, 1);
                    setSubtasks(newSubtasks);
                  }}
                  className="-mr-3 ml-2 cursor-pointer hover:bg-button-primary"
                >
                  <CloseIcon />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => setSubtasks([...subtasks, ''])}
              className="heading-md text-button-primary bg-button-secondary hover:bg-button-secondary-hover cursor-pointer px-4.5  py-4.5 rounded-3xl disabled:pointer-events-none"
              disabled={loading}
            >
              + Add New Subtask
            </Button>

            <label htmlFor="status" className="body-md text-secondary-text">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={column?.title || ''}
              onChange={handleChangeColumn}
              className="cursor-pointer border border-[#828FA3] px-4 py-2 rounded-sm w-full"
            >
              {columns.map((column) => (
                <option key={column.id} value={column.title}>
                  {column.title}
                </option>
              ))}
            </select>

            <Button
              onClick={handleCreateTask}
              className="heading-md text-white bg-button-primary hover:bg-button-primary-hover cursor-pointer px-4.5  py-4.5 mt-4 rounded-3xl disabled:pointer-events-none"
              disabled={loading}
            >
              {loading ? <Spinner /> : 'Create Task'}
            </Button>
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTask;
