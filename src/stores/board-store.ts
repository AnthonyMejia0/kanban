'use client';

import { create } from 'zustand';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import {
  BoardType,
  ColumnType,
  NewColumn,
  SubtaskType,
  TaskType,
} from '@/types/board';

type BoardStore = {
  // =====================
  // STATE (EXACT MATCH)
  // =====================
  boards: BoardType[];
  columns: ColumnType[];
  tasks: TaskType[];
  subtasks: SubtaskType[];

  // ===== SETTERS =====
  setBoards: (boards: BoardType[]) => void;
  setColumns: (columns: ColumnType[]) => void;
  setTasks: (tasks: TaskType[]) => void;
  setSubtasks: (subtasks: SubtaskType[]) => void;

  // =====================
  // ACTIONS (EXACT MATCH)
  // =====================
  loadBoards: () => Promise<void>;
  loadBoard: (boardId: string) => Promise<void>;

  createBoard: (
    title: string,
    userId: string,
    columns: NewColumn[],
  ) => Promise<boolean>;

  deleteBoard: (boardId: string, userId: string) => Promise<boolean>;

  createTask: (
    title: string,
    description: string,
    subtasks: string[],
    columnId: string,
    activeBoardId: string,
  ) => Promise<boolean>;

  updateBoard: (
    boardId: string,
    title: string,
    columns: NewColumn[],
  ) => Promise<boolean>;

  toggleSubtask: (
    currentCompletion: boolean,
    subtaskId: string,
  ) => Promise<void>;

  updateTaskColumn: (taskId: string, columnId: string) => Promise<void>;
};

const supabase = getSupabaseBrowserClient();

export const useBoardStore = create<BoardStore>((set, get) => {
  // =====================
  // HELPERS
  // =====================
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  };

  return {
    // =====================
    // STATE
    // =====================
    boards: [],
    columns: [],
    tasks: [],
    subtasks: [],

    // =====================
    // SETTERS
    // =====================
    setBoards: (boards) => set({ boards }),
    setColumns: (columns) => set({ columns }),
    setTasks: (tasks) => set({ tasks }),
    setSubtasks: (subtasks) => set({ subtasks }),

    // =====================
    // LOAD BOARDS (UNCHANGED)
    // =====================
    loadBoards: async () => {
      const user = await getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('kanban_boards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error || !data || data.length < 1) return;

      set({ boards: [...data] });
    },

    loadBoard: async (boardId: string) => {
      const { setColumns, setTasks, setSubtasks } = get();
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
    },

    // =====================
    // CREATE BOARD (UNCHANGED)
    // =====================
    createBoard: async (title, userId, columns) => {
      if (!title || !userId) return false;

      const { error: boardError, data: board } = await supabase
        .from('kanban_boards')
        .insert({
          title,
          user_id: userId,
        })
        .select()
        .single();

      if (boardError || !board) return false;

      if (columns.length > 0) {
        const formatted = columns.map((column) => ({
          board_id: board.id,
          title: column.title,
          position: column.position,
        }));

        const { error: columnsError } = await supabase
          .from('kanban_columns')
          .insert(formatted);

        if (columnsError) return false;
      }

      await get().loadBoards();
      return true;
    },

    deleteBoard: async (boardId, userId) => {
      return true;
    },

    // =====================
    // CREATE TASK (UNCHANGED)
    // =====================
    createTask: async (
      title,
      description,
      subtasks,
      columnId,
      activeBoardId,
    ) => {
      const user = await getUser();

      if (!title || !user || !activeBoardId) return false;

      const { tasks } = get();

      const lastPosition =
        tasks.length === 0 ? 1000 : tasks[tasks.length - 1].position + 1000;

      const { data: task, error } = await supabase
        .from('kanban_tasks')
        .insert({
          board_id: activeBoardId,
          title,
          description,
          position: lastPosition,
          column_id: columnId,
        })
        .select()
        .single();

      if (error || !task) return false;

      if (subtasks.length > 0) {
        const formattedSubtasks = subtasks.map((subtask, i) => ({
          task_id: task.id,
          title: subtask,
          complete: false,
          position: (i + 1) * 1000,
        }));

        const { error: subtaskError } = await supabase
          .from('kanban_subtasks')
          .insert(formattedSubtasks);

        if (subtaskError) return false;
      }

      await get().loadBoards();

      return true;
    },

    // =====================
    // UPDATE BOARD (UNCHANGED)
    // =====================
    updateBoard: async (boardId, title, columns) => {
      if (!boardId || !title) return false;

      const { error: boardError } = await supabase
        .from('kanban_boards')
        .update({ title })
        .eq('id', boardId);

      if (boardError) return false;

      const { data: existingColumns, error: fetchError } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('board_id', boardId);

      if (!existingColumns || fetchError) return false;

      const existingIds = existingColumns.map((c) => c.id);

      const incomingIds = columns
        .filter((c) => !c.id.startsWith('temp-'))
        .map((c) => c.id);

      const deletedIds = existingIds.filter((id) => !incomingIds.includes(id));

      if (deletedIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('kanban_columns')
          .delete()
          .in('id', deletedIds);

        if (deleteError) return false;
      }

      const newColumns = columns.filter((c) => c.id.startsWith('temp-'));

      const updatedColumns = columns.filter((c) => !c.id.startsWith('temp-'));

      if (newColumns.length > 0) {
        const { error: insertError } = await supabase
          .from('kanban_columns')
          .insert(
            newColumns.map((c) => ({
              board_id: boardId,
              title: c.title,
              position: c.position,
            })),
          );

        if (insertError) return false;
      }

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

      await get().loadBoards();
      return true;
    },

    // =====================
    // TOGGLE SUBTASK (UNCHANGED)
    // =====================
    toggleSubtask: async (current, subtaskId) => {
      const { subtasks } = get();

      set({
        subtasks: subtasks.map((s) =>
          s.id === subtaskId ? { ...s, complete: !current } : s,
        ),
      });

      const { error } = await supabase
        .from('kanban_subtasks')
        .update({ complete: !current })
        .eq('id', subtaskId);

      if (error) {
        set({
          subtasks: subtasks.map((s) =>
            s.id === subtaskId ? { ...s, complete: current } : s,
          ),
        });
      }
    },

    // =====================
    // UPDATE TASK COLUMN (UNCHANGED)
    // =====================
    updateTaskColumn: async (taskId, columnId) => {
      const { tasks } = get();

      const previous = [...tasks];

      set({
        tasks: tasks.map((t) =>
          t.id === taskId ? { ...t, column_id: columnId } : t,
        ),
      });

      const { error } = await supabase
        .from('kanban_tasks')
        .update({ column_id: columnId })
        .eq('id', taskId);

      if (error) {
        set({ tasks: previous });
      }
    },
  };
});
