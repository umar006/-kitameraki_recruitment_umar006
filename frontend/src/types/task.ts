export type Task = {
  id: string;
  title: string;
  status: string;
  description: string;
  dueDate: string;
  priority: string;
  tags: string[];
};

export type AddTask = {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  priority?: string;
  tags?: string[];
};

export type UpdateTask = {
  id: string;
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  priority?: string;
  tags?: string[];
};
