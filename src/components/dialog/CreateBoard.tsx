import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Field, FieldGroup } from '../ui/field';
import { Button } from '../ui/button';
import CloseIcon from '@/assets/icon-cross.svg';
import { NewColumn } from '@/types/board';
import { useBoards } from '@/context/BoardContext';
import { useUser } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import { useDialog } from '@/context/DialogContext';

function CreateBoard() {
  const [name, setName] = useState('');
  const [columns, setColumns] = useState<NewColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    activeBoard,
    columns: boardColumns,
    createBoard,
    updateBoard,
  } = useBoards();
  const { user } = useUser();
  const {
    createBoardOpen: open,
    setCreateBoardOpen: setOpen,
    editingBoard: editing,
  } = useDialog();
  const buttonLabel = editing ? 'Save Changes' : 'Create New Board';

  const handleAddColumn = () => {
    const lastPosition =
      columns.length > 0 ? columns[columns.length - 1].position : 0;

    setColumns((prev) => [
      ...prev,
      {
        id: `temp-${crypto.randomUUID().slice(0, 6)}`,
        title: '',
        position: lastPosition + 1000,
      },
    ]);
  };

  const handleRemoveColumn = (id: string) => {
    setColumns((prev) => prev.filter((column) => column.id !== id));
  };

  const handleColumnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    const value = e.target.value;

    setColumns((prev) =>
      prev.map((column) =>
        id === column.id ? { ...column, title: value } : column,
      ),
    );
  };

  const handleCreateBoard = async () => {
    if (!name || !user) {
      toast.error('Missing values.');
      return;
    }

    setLoading(true);

    const success = await createBoard(name, user.id, columns);

    if (!success) {
      toast.error('Failed to create board.');
      setLoading(false);
      return;
    }

    toast.success('Board created successfully.');
    setLoading(false);
    setOpen(false);
    return;
  };

  const handleUpdateBoard = async () => {
    if (!name || !editing) return;
    if (!activeBoard) {
      toast.error('No board selected.');
      return;
    }

    setLoading(true);

    const success = await updateBoard(activeBoard.id, name, columns);

    if (!success) {
      toast.error('Failed to update board.');
      setLoading(false);
      return;
    }

    toast.success('Board updated successfully.');
    setLoading(false);
    setOpen(false);
    return;
  };

  useEffect(() => {
    if (editing && activeBoard) {
      setName(activeBoard.title);
      setColumns(boardColumns);
    }
  }, [editing, activeBoard, boardColumns]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-foreground p-8" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-primary-text heading-lg">
            {editing ? 'Edit Board' : 'Add New Board'}
          </DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <label htmlFor="name" className="body-md text-secondary-text">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Web Design"
              className="border border-[#828FA3] px-4 py-2 rounded-sm"
            />
            {columns.length > 0 && (
              <p className="body-md text-secondary-text">Board Columns</p>
            )}
            {columns.map((c) => (
              <div key={c.id} className="w-full flex flex-row items-center">
                <input
                  type="text"
                  name="column"
                  value={c.title}
                  onChange={(e) => handleColumnChange(e, c.id)}
                  className="border border-[#828FA3] px-4 py-2 rounded-sm flex-1"
                  placeholder="e.g. Todo"
                />
                <Button
                  onClick={() => handleRemoveColumn(c.id)}
                  className="-mr-3 ml-2 cursor-pointer hover:bg-button-primary"
                >
                  <CloseIcon />
                </Button>
              </div>
            ))}
            <Button
              onClick={handleAddColumn}
              className="heading-md text-button-primary bg-button-secondary hover:bg-button-secondary-hover cursor-pointer px-4.5  py-4.5 rounded-3xl disabled:pointer-events-none"
              disabled={loading}
            >
              + Add New Column
            </Button>
            <Button
              onClick={editing ? handleUpdateBoard : handleCreateBoard}
              className="heading-md text-white bg-button-primary hover:bg-button-primary-hover cursor-pointer px-4.5  py-4.5 mt-4 rounded-3xl disabled:pointer-events-none"
              disabled={loading}
            >
              {loading ? <Spinner /> : buttonLabel}
            </Button>
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}

export default CreateBoard;
