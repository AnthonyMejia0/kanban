'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import {
  BoardType,
  ColumnType,
  NewColumn,
  SubtaskType,
  TaskType,
} from '@/types/board';

type BoardsContextType = {
  boards: BoardType[];
  columns: ColumnType[];
  tasks: TaskType[];
  subtasks: SubtaskType[];
  activeBoard: BoardType | null;
  currentTask: TaskType | null;
  setCurrentTask: Dispatch<SetStateAction<TaskType | null>>;
  loadBoards: () => Promise<void>;
  createBoard: (
    title: string,
    userId: string,
    columns: NewColumn[],
  ) => Promise<boolean>;
  createTask: (
    title: string,
    description: string,
    subtasks: string[],
    columnId: string,
  ) => Promise<boolean>;
  updateBoard: (
    boardId: string,
    title: string,
    columns: NewColumn[],
  ) => Promise<boolean>;
  selectBoard: (board: BoardType) => Promise<void>;
  toggleSubtask: (
    currentCompletion: boolean,
    subtaskId: string,
  ) => Promise<void>;
  updateTaskColumn: (taskId: string, columnId: string) => Promise<void>;
};

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export function BoardsProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [subtasks, setSubtasks] = useState<SubtaskType[]>([]);
  const [activeBoard, setActiveBoard] = useState<BoardType | null>(null);
  const [currentTask, setCurrentTask] = useState<TaskType | null>(null);
  const supabase = getSupabaseBrowserClient();

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  };

  const loadBoards = async () => {
    const user = await getUser();

    if (!user) return;
    const { data, error } = await supabase
      .from('kanban_boards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at');

    if (error || !data || data.length < 1) return;

    setBoards([...data]);
  };

  const createBoard = async (
    title: string,
    userId: string,
    columns: NewColumn[],
  ) => {
    if (!title || !userId) return false;

    // Create board
    const { data: board, error: boardError } = await supabase
      .from('kanban_boards')
      .insert({
        title,
        user_id: userId,
      })
      .select()
      .single();

    if (boardError || !board) return false;

    // Create columns
    if (columns.length > 0) {
      const formattedColumns = columns.map((column) => ({
        board_id: board.id,
        title: column.title,
        position: column.position,
      }));

      const { error: columnsError } = await supabase
        .from('kanban_columns')
        .insert(formattedColumns);

      if (columnsError) return false;
    }

    await loadBoards();

    return true;
  };

  const createTask = async (
    title: string,
    description: string = '',
    subtasks: string[],
    columnId: string,
  ) => {
    const user = await getUser();
    if (!title || !user || !subtasks || !activeBoard) return false;

    const lastPosition =
      tasks.length === 0 ? 1000 : tasks[tasks.length - 1].position + 1000;

    const { data: task, error: taskError } = await supabase
      .from('kanban_tasks')
      .insert({
        board_id: activeBoard.id,
        title,
        description,
        position: lastPosition,
        column_id: columnId,
      })
      .select()
      .single();

    if (!task || taskError) return false;

    if (subtasks.length > 0) {
      const formattedSubtasks = subtasks.map((subtask, i) => ({
        task_id: task.id,
        title: subtask,
        complete: false,
        position: (i + 1) * 1000,
      }));

      const { error: subtasksError } = await supabase
        .from('kanban_subtasks')
        .insert(formattedSubtasks);

      if (subtasksError) return false;
    }

    await loadBoards();

    return true;
  };

  const updateBoard = async (
    boardId: string,
    title: string,
    columns: NewColumn[],
  ) => {
    if (!boardId || !title) return false;

    // Update board title
    const { error: boardError } = await supabase
      .from('kanban_boards')
      .update({ title })
      .eq('id', boardId);

    if (boardError) return false;

    // Get current DB columns
    const { data: existingColumns, error: fetchError } = await supabase
      .from('kanban_columns')
      .select('*')
      .eq('board_id', boardId);

    if (fetchError || !existingColumns) return false;

    const existingIds = existingColumns.map((c) => c.id);

    // Columns user still has
    const incomingIds = columns
      .filter((c) => !c.id.startsWith('temp-'))
      .map((c) => c.id);

    // Delete removed columns
    const deletedIds = existingIds.filter((id) => !incomingIds.includes(id));

    if (deletedIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('kanban_columns')
        .delete()
        .in('id', deletedIds);

      if (deleteError) return false;
    }

    // Separate new vs existing columns
    const newColumns = columns.filter((c) => c.id.startsWith('temp-'));

    const updatedColumns = columns.filter((c) => !c.id.startsWith('temp-'));

    // Insert new columns
    if (newColumns.length > 0) {
      const { error: insertError } = await supabase
        .from('kanban_columns')
        .insert(
          newColumns.map((column) => ({
            board_id: boardId,
            title: column.title,
            position: column.position,
          })),
        );

      if (insertError) return false;
    }

    // Update existing columns
    for (const column of updatedColumns) {
      const { error } = await supabase
        .from('kanban_columns')
        .update({
          title: column.title,
          position: column.position,
        })
        .eq('id', column.id);

      if (error) return false;
    }

    await loadBoards();

    return true;
  };

  const loadBoard = async (boardId: string) => {
    const [boardRes, columnsRes, tasksRes] = await Promise.all([
      supabase.from('kanban_boards').select('*').eq('id', boardId).single(),

      supabase
        .from('kanban_columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position'),

      supabase
        .from('kanban_tasks')
        .select('*')
        .eq('board_id', boardId)
        .order('position'),
    ]);

    if (columnsRes.data) {
      setColumns(columnsRes.data);
    }

    if (tasksRes.data) {
      setTasks(tasksRes.data);

      const taskIds = tasksRes.data.map((task) => task.id);

      if (taskIds.length > 0) {
        const { data: subtasksData } = await supabase
          .from('kanban_subtasks')
          .select('*')
          .in('task_id', taskIds)
          .order('position');

        if (subtasksData) {
          setSubtasks(subtasksData);
        }
      } else {
        setSubtasks([]);
      }
    }

    if (currentTask) {
      const task = tasks.find((t) => t.id === currentTask.id);
      if (task) {
        setCurrentTask(task);
      }
    }
  };

  const selectBoard = async (board: BoardType) => {
    setActiveBoard(board);
    await loadBoard(board.id);
  };

  const toggleSubtask = async (
    currentCompletion: boolean,
    subtaskId: string,
  ) => {
    await supabase
      .from('kanban_subtasks')
      .update({
        complete: !currentCompletion,
      })
      .eq('id', subtaskId);

    await loadBoards();
  };

  const updateTaskColumn = async (taskId: string, columnId: string) => {
    await supabase
      .from('kanban_tasks')
      .update({ column_id: columnId })
      .eq('id', taskId);
    await loadBoards();
  };

  useEffect(() => {
    if (boards.length === 0) {
      setActiveBoard(null);
      return;
    }

    // No active board yet → select first
    if (!activeBoard) {
      setActiveBoard(boards[0]);
      return;
    }

    // Sync updated board data
    const updatedBoard = boards.find((board) => board.id === activeBoard.id);

    if (updatedBoard) {
      setActiveBoard(updatedBoard);
    }
  }, [boards]);

  useEffect(() => {
    if (!activeBoard) return;
    loadBoard(activeBoard.id);
  }, [activeBoard]);

  useEffect(() => {
    loadBoards();
  }, []);

  return (
    <BoardsContext.Provider
      value={{
        boards,
        columns,
        tasks,
        subtasks,
        activeBoard,
        currentTask,
        setCurrentTask,
        loadBoards,
        createBoard,
        createTask,
        updateBoard,
        selectBoard,
        toggleSubtask,
        updateTaskColumn,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
}

export function useBoards() {
  const context = useContext(BoardsContext);

  if (!context) {
    throw new Error('useUser must be used within a BoardsProvider');
  }

  return context;
}
