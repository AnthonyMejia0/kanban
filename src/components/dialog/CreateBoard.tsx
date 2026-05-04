import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Field, FieldGroup } from '../ui/field';
import { Button } from '../ui/button';
import CloseIcon from '@/assets/icon-cross.svg';
import { NewColumn } from '@/types/board';
import { useUser } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import { useUIStore } from '@/stores/ui-store';
import { useNavStore } from '@/stores/nav-store';
import { useBoardStore } from '@/stores/board-store';
import { Color, ColorPicker } from 'react-beautiful-color';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function CreateBoard() {
  const [name, setName] = useState('');
  const [columns, setColumns] = useState<NewColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const boards = useBoardStore((s) => s.boards);
  const boardColumns = useBoardStore((s) => s.columns);
  const createBoard = useBoardStore((s) => s.createBoard);
  const updateBoard = useBoardStore((s) => s.updateBoard);

  const { user } = useUser();
  const open = useUIStore((s) => s.createBoardOpen);
  const setOpen = useUIStore((s) => s.setCreateBoardOpen);
  const editing = useUIStore((s) => s.editingBoard);
  const activeBoardId = useNavStore((s) => s.activeBoardId);
  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? null;
  const buttonLabel = editing ? 'Save Changes' : 'Create New Board';
  const [colors, setColors] = useState<Color[]>([]);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);

  const handleAddColumn = () => {
    const lastPosition =
      columns.length > 0 ? columns[columns.length - 1].position : 0;

    setColumns((prev) => [
      ...prev,
      {
        id: `temp-${crypto.randomUUID().slice(0, 6)}`,
        title: '',
        position: lastPosition + 1000,
        color: '#635fc7',
      },
    ]);
  };

  const handleColorChange = (color: Color) => {
    if (activeColorIndex === null) return;

    setColumns((prev) =>
      prev.map((column, index) =>
        index === activeColorIndex
          ? { ...column, color: color.getHex() }
          : column,
      ),
    );

    setColors((prev) =>
      prev.map((c, index) => (index === activeColorIndex ? color : c)),
    );
  };

  const handleRemoveColumn = (id: string) => {
    setColumns((prev) => prev.filter((column) => column.id !== id));
    setOpenColorPicker(false);
    setActiveColorIndex(null);
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
      setColors(
        columns.map((c) => {
          return new Color({
            type: 'hex',
            value: c.color,
          });
        }),
      );
    } else {
      setName('');
      setColumns([]);
      setColors([]);
    }
  }, [editing, activeBoard, boardColumns]);

  useEffect(() => {
    setColors(
      columns.map((c) => {
        return new Color({
          type: 'hex',
          value: c.color,
        });
      }),
    );
  }, [columns]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setActiveColorIndex(null);
          setOpenColorPicker(false);
          setColumns([]);
        }

        setOpen(open);
      }}
    >
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
            {columns.map((c, i) => (
              <div key={c.id} className="w-full flex flex-row items-center">
                <input
                  type="text"
                  name="column"
                  value={c.title}
                  onChange={(e) => handleColumnChange(e, c.id)}
                  className="border border-[#828FA3] px-4 py-2 rounded-sm flex-1"
                  placeholder="e.g. Todo"
                />
                <DropdownMenu
                  open={openColorPicker && activeColorIndex === i}
                  onOpenChange={(open) => {
                    if (!open) setActiveColorIndex(null);
                    setOpenColorPicker(open);
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      onClick={() => {
                        setActiveColorIndex(i);
                        setOpenColorPicker(true);
                      }}
                      className="w-6 h-6 ml-2 rounded-full cursor-pointer"
                      style={{ backgroundColor: c.color }}
                    ></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-lg bg-foreground w-max h-max shadow-xl border border-secondary-text"
                  >
                    <ColorPicker
                      color={colors[i]}
                      onChange={handleColorChange}
                      className="w-50 h-max bg-foreground p-2 rounded-lg shadow-none"
                    >
                      <ColorPicker.Saturation className="h-40 mb-3 rounded-md overflow-hidden" />
                      <ColorPicker.Hue className="h-4 rounded-full" />
                    </ColorPicker>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={() => handleRemoveColumn(c.id)}
                  className="-mr-3 ml-1 cursor-pointer hover:bg-button-secondary-hover"
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
