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

function DeleteBoard() {
  const boards = useBoardStore((s) => s.boards);
  const deleteBoard = useBoardStore((s) => s.deleteBoard);
  const deleteBoardOpen = useUIStore((s) => s.deleteBoardOpen);
  const setDeleteBoardOpen = useUIStore((s) => s.setDeleteBoardOpen);
  const activeBoardId = useNavStore((s) => s.activeBoardId);
  const setActiveBoardId = useNavStore((s) => s.setActiveBoardId);
  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? null;
  const [loading, setLoading] = useState(false);

  const handleDeleteBoard = async () => {
    if (!activeBoardId) return;
    setLoading(true);

    const success = await deleteBoard(activeBoardId);

    if (success) {
      toast.success('Board deleted successfully.');
    } else {
      toast.error('Failed to delete board.');
    }

    setActiveBoardId(null);
    setDeleteBoardOpen(false);
    setLoading(false);
  };

  return (
    <Dialog open={deleteBoardOpen} onOpenChange={setDeleteBoardOpen}>
      <DialogContent className="bg-foreground p-8 max-w-[90vw] md:max-w-120">
        <DialogTitle className="text-urgent-text heading-lg text-left">
          Delete this board?
        </DialogTitle>
        <DialogDescription className="text-secondary-text body-lg">
          Are you sure you want to delete the '{activeBoard?.title}' board? This
          action will remove all columns and tasks and cannot be reversed.
        </DialogDescription>
        <DialogFooter className="w-full flex flex-col md:flex-row md:justify-evenly items-center">
          <Button
            onClick={handleDeleteBoard}
            className="w-full min-h-10 flex-1 rounded-[20px] cursor-pointer disabled:pointer-events-none bg-button-destructive hover:bg-button-destructive-hover font-bold text-[13px] leading-5.75 text-white"
            disabled={loading}
          >
            {loading ? <Spinner width={16} height={16} /> : 'Delete'}
          </Button>
          <Button
            onClick={() => setDeleteBoardOpen(false)}
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

export default DeleteBoard;
