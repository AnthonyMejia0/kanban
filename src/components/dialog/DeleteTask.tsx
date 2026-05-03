import { useUIStore } from '@/stores/ui-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '../ui/dialog';
import { useNavStore } from '@/stores/nav-store';
import { useBoardStore } from '@/stores/board-store';
import { Button } from '../ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';

function DeleteTask() {
  const tasks = useBoardStore((s) => s.tasks);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const deleteTaskOpen = useUIStore((s) => s.deleteTaskOpen);
  const setDeleteTaskOpen = useUIStore((s) => s.setDeleteTaskOpen);
  const selectedTaskId = useNavStore((s) => s.selectedTaskId);
  const setSelectedTaskId = useNavStore((s) => s.setSelectedTaskId);
  const currentTask = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const [loading, setLoading] = useState(false);

  const handleDeleteTask = async () => {
    if (!selectedTaskId) return;
    console.log('Deleting task w/ ID: ', selectedTaskId);

    setLoading(true);

    const success = await deleteTask(selectedTaskId);

    if (success) {
      toast.success('Task deleted successfully.');
    } else {
      toast.error('Failed to delete task.');
    }

    setSelectedTaskId(null);
    setDeleteTaskOpen(false);
    setLoading(false);
  };

  return (
    <Dialog open={deleteTaskOpen} onOpenChange={setDeleteTaskOpen}>
      <DialogContent className="bg-foreground p-8 max-w-[90vw] md:max-w-120">
        <DialogTitle className="text-urgent-text heading-lg text-left">
          Delete this task?
        </DialogTitle>
        <DialogDescription className="text-secondary-text body-lg">
          Are you sure you want to delete the '{currentTask?.title}' task and
          its subtasks? This action cannot be reversed.
        </DialogDescription>
        <DialogFooter className="w-full flex flex-col md:flex-row md:justify-evenly items-center">
          <Button
            onClick={handleDeleteTask}
            className="w-full min-h-10 flex-1 rounded-[20px] cursor-pointer disabled:pointer-events-none bg-button-destructive hover:bg-button-destructive-hover font-bold text-[13px] leading-5.75 text-white"
            disabled={loading}
          >
            {loading ? <Spinner width={16} height={16} /> : 'Delete'}
          </Button>
          <Button
            onClick={() => setDeleteTaskOpen(false)}
            className="w-full min-h-10 flex-1 rounded-[20px] cursor-pointer disabled:pointer-events-none bg-button-cancel hover:bg-button-cancel-hover font-bold text-[13px] leading-5.75 text-button-primary"
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteTask;
