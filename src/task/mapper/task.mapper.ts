import { Task, TaskDocument } from './../schema/task.schema';

export class TaskMapper {
  static toDomain(raw: TaskDocument): Task {
    const task = new Task();

    task.id = raw.id;
    task.status = raw.status;
    task.title = raw.title;
    task.description = raw.description;
    task.priority = raw.priority;
    task.dueDate = raw.dueDate;
    task.tags = raw.tags;

    return task;
  }
}
