import { AddTask, Task } from '../types/task';

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL.trim() || 'http://localhost:3000';

export const createTask = async (task: AddTask): Promise<Task> => {
  const title = task.title?.trim() ? task.title : undefined;
  const description = task.description?.trim() ? task.description : undefined;
  const dueDate = task.dueDate?.trim() ? task.dueDate : undefined;
  const status = task.status?.trim() ? task.status : undefined;
  const priority = task.priority?.trim() ? task.priority : undefined;
  const tags = task.tags;

  const newTask = {
    title,
    description,
    dueDate,
    status,
    priority,
    tags,
  };

  const res = await fetch(`${BASE_URL}/v1/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  });

  if (!res.ok) {
    const error = (await res.json()) as { error: string };
    throw new Error(error.error);
  }

  const createdTask = await res.json();

  return createdTask;
};

export const getTaskList = async (): Promise<Task[]> => {
  const res = await fetch(`${BASE_URL}/v1/tasks`);
  const taskList = await res.json();
  return taskList;
};
