import { Task, TaskDocument } from './task.schema';

export class TaskMapper {
  static toDomain(raw: TaskDocument): Task {
    const task = new Task();

    task.id = raw.id;
    task.status = raw.status;
    task.title = raw.title;
    task.description = raw.description;
    task.priority = raw.priority;
    task.dueDate = raw.dueDate;

    return task;
  }
}
