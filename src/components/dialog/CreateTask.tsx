import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Field, FieldGroup } from '../ui/field';
import { Button } from '../ui/button';
import { useDialog } from '@/context/DialogContext';
import { useState } from 'react';
import { Spinner } from '../ui/spinner';
import CloseIcon from '@/assets/icon-cross.svg';

const descriptionPlaceholder =
  "e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little.";

function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const { createTaskOpen, setCreateTaskOpen } = useDialog();

  const handleCreateTask = async () => {
    // Handle task creation logic here
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
