'use client';

import { create } from 'zustand';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import {
  BoardType,
  ColumnType,
  NewColumn,
  NewSubtask,
  SubtaskType,
  TaskType,
} from '@/types/board';

type BoardStore = {
  boards: BoardType[];
  columns: ColumnType[];
  tasks: TaskType[];
  subtasks: SubtaskType[];

  setBoards: (boards: BoardType[]) => void;
  setColumns: (columns: ColumnType[]) => void;
  setTasks: (tasks: TaskType[]) => void;
  setSubtasks: (subtasks: SubtaskType[]) => void;

  loadBoards: () => Promise<void>;
  loadBoard: (boardId: string) => Promise<void>;

  createBoard: (
    title: string,
    userId: string,
    columns: NewColumn[],
  ) => Promise<boolean>;

  deleteBoard: (boardId: string) => Promise<boolean>;

  createTask: (
    title: string,
    description: string,
    subtasks: NewSubtask[],
    columnId: string,
    activeBoardId: string,
  ) => Promise<boolean>;

  updateTask: (
    taskId: string,
    title: string,
    description: string,
    subtasks: NewSubtask[],
    columnId: string,
  ) => Promise<boolean>;

  deleteTask: (taskId: string) => Promise<boolean>;

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
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  };

  return {
    boards: [],
    columns: [],
    tasks: [],
    subtasks: [],

    setBoards: (boards) => set({ boards }),
    setColumns: (columns) => set({ columns }),
    setTasks: (tasks) => set({ tasks }),
    setSubtasks: (subtasks) => set({ subtasks }),

    loadBoards: async () => {
      const user = await getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('kanban_boards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error || !data) return;

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
          color: column.color,
        }));

        const { error: columnsError } = await supabase
          .from('kanban_columns')
          .insert(formatted);

        if (columnsError) return false;
      }

      await get().loadBoards();
      return true;
    },

    deleteBoard: async (boardId) => {
      const user = await getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('kanban_boards')
        .delete()
        .eq('id', boardId)
        .eq('user_id', user.id);

      if (error) return false;

      await get().loadBoards();
      return true;
    },

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
          title: subtask.title,
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

    updateTask: async (taskId, title, description, subtasks, columnId) => {
      if (!taskId || !title) return false;

      // Update task
      const { error: taskError } = await supabase
        .from('kanban_tasks')
        .update({
          title,
          description,
          column_id: columnId,
        })
        .eq('id', taskId);

      if (taskError) return false;

      // Fetch existing subtasks
      const { data: existingSubtasks, error: fetchError } = await supabase
        .from('kanban_subtasks')
        .select('*')
        .eq('task_id', taskId);

      if (!existingSubtasks || fetchError) return false;

      const existingIds = existingSubtasks.map((s) => s.id);

      // Incoming existing ids
      const incomingIds = subtasks
        .filter((s) => !s.id.startsWith('temp-'))
        .map((s) => s.id);

      // Deleted subtasks
      const deletedIds = existingIds.filter((id) => !incomingIds.includes(id));

      if (deletedIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('kanban_subtasks')
          .delete()
          .in('id', deletedIds);

        if (deleteError) return false;
      }

      // Separate new vs existing
      const newSubtasks = subtasks.filter((s) => s.id.startsWith('temp-'));

      const updatedSubtasks = subtasks.filter((s) => !s.id.startsWith('temp-'));

      // Insert new subtasks
      if (newSubtasks.length > 0) {
        const { error: insertError } = await supabase
          .from('kanban_subtasks')
          .insert(
            newSubtasks.map((s) => ({
              task_id: taskId,
              title: s.title,
              complete: s.complete,
              position: s.position,
            })),
          );

        if (insertError) return false;
      }

      // Update existing subtasks
      for (const subtask of updatedSubtasks) {
        const { error } = await supabase
          .from('kanban_subtasks')
          .update({
            title: subtask.title,
            complete: subtask.complete,
            position: subtask.position,
          })
          .eq('id', subtask.id);

        if (error) return false;
      }

      await get().loadBoards();

      return true;
    },

    deleteTask: async (taskId) => {
      const { error } = await supabase
        .from('kanban_tasks')
        .delete()
        .eq('id', taskId);

      if (error) return false;

      await get().loadBoards();
      return true;
    },

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
              color: c.color,
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
            color: column.color,
          })
          .eq('id', column.id);

        if (error) return false;
      }

      await get().loadBoards();
      return true;
    },

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

      await get().loadBoards();
    },
  };
});
