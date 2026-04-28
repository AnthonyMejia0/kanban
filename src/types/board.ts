export type BoardType = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
};

export type NewColumn = {
  id: string;
  title: string;
  position: number;
};

export type ColumnType = {
  id: string;
  board_id: string;
  title: string;
  position: number;
  created_at: string;
};

export type TaskType = {
  id: string;
  board_id: string;
  column_id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
};

export type SubtaskType = {
  id: string;
  task_id: string;
  title: string;
  complete: boolean;
  position: number;
  created_at: string;
};
