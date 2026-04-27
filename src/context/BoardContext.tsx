'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { BoardType, ColumnType, SubtaskType, TaskType } from '@/types/board';

type BoardsContextType = {
  boards: BoardType[];
  columns: ColumnType[];
  tasks: TaskType[];
  subtasks: SubtaskType[];
  activeBoard: BoardType | null;
  loadBoards: () => Promise<void>;
  createBoard: (title: string, userId: string) => Promise<boolean>;
  selectBoard: (board: BoardType) => Promise<void>;
};

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export function BoardsProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [subtasks, setSubtasks] = useState<SubtaskType[]>([]);
  const [activeBoard, setActiveBoard] = useState<BoardType | null>(null);
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
      .eq('user_id', user.id);

    if (error || !data || data.length < 1) return;

    setBoards([...data]);
  };

  const createBoard = async (title: string, userId: string) => {
    if (!title || !userId) return false;

    const { error } = await supabase.from('kanban_boards').insert({
      title,
      user_id: userId,
    });

    if (error) return false;

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
          .in('task_id', taskIds);

        if (subtasksData) {
          setSubtasks(subtasksData);
        }
      } else {
        setSubtasks([]);
      }
    }
  };

  const selectBoard = async (board: BoardType) => {
    setActiveBoard(board);
    await loadBoard(board.id);
  };

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
        loadBoards,
        createBoard,
        selectBoard,
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
