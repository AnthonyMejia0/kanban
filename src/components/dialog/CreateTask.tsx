'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Field, FieldGroup } from '../ui/field';
import { Button } from '../ui/button';
import React, { useState, useMemo } from 'react';
import { Spinner } from '../ui/spinner';
import CloseIcon from '@/assets/icon-cross.svg';
import { toast } from 'sonner';
import { useUIStore } from '@/stores/ui-store';
import { useBoardStore } from '@/stores/board-store';
import { useNavStore } from '@/stores/nav-store';

const descriptionPlaceholder =
  "e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little.";

function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [columnId, setColumnId] = useState<string>('');

  const createTaskOpen = useUIStore((s) => s.createTaskOpen);
  const setCreateTaskOpen = useUIStore((s) => s.setCreateTaskOpen);

  const columns = useBoardStore((s) => s.columns);
  const createTask = useBoardStore((s) => s.createTask);

  const activeBoardId = useNavStore((s) => s.activeBoardId);

  const handleCreateTask = async () => {
    if (!title.trim()) {
      toast.error('Task title cannot be empty.');
      return;
    }

    if (!activeBoardId) return;

    if (!columnId) {
      toast.error('Please select a column.');
      return;
    }

    setLoading(true);

    const success = await createTask(
      title,
      description,
      subtasks,
      columnId,
      activeBoardId,
    );

    if (!success) {
      toast.error('Failed to create task.');
      setLoading(false);
      return;
    }

    toast.success('Task created successfully.');

    setLoading(false);
    setCreateTaskOpen(false);

    setTitle('');
    setDescription('');
    setSubtasks([]);
    setColumnId('');
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
                  value={s}
                  onChange={(e) => {
                    const updated = [...subtasks];
                    updated[index] = e.target.value;
                    setSubtasks(updated);
                  }}
                  className="border border-[#828FA3] px-4 py-2 rounded-sm flex-1"
                  placeholder="e.g. Research"
                />
                <Button
                  onClick={() => {
                    const updated = [...subtasks];
                    updated.splice(index, 1);
                    setSubtasks(updated);
                  }}
                  className="-mr-3 ml-2 cursor-pointer hover:bg-button-primary"
                >
                  <CloseIcon />
                </Button>
              </div>
            ))}

            <Button
              onClick={() => setSubtasks([...subtasks, ''])}
              className="heading-md text-button-primary bg-button-secondary hover:bg-button-secondary-hover cursor-pointer px-4.5 py-4.5 rounded-3xl"
              disabled={loading}
            >
              + Add New Subtask
            </Button>

            <label htmlFor="status" className="body-md text-secondary-text">
              Status
            </label>

            <select
              id="status"
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
              className="cursor-pointer border border-[#828FA3] px-4 py-2 rounded-sm w-full"
            >
              <option value="" disabled>
                Select a column
              </option>

              {columns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <Button
              onClick={handleCreateTask}
              disabled={loading}
              className="heading-md text-white bg-button-primary hover:bg-button-primary-hover cursor-pointer px-4.5 py-4.5 mt-4 rounded-3xl"
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
