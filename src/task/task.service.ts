import { Injectable } from '@nestjs/common';
import { User } from '../user/schema/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskNotFoundException } from './exception/task-not-found.exception';
import { Task } from './schema/task.schema';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  getAllTasks(query: QueryTaskDto): Promise<Task[]> {
    return this.taskRepository.getAllTasks(query);
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskRepository.getTaskById(taskId);
    if (!task) {
      throw new TaskNotFoundException();
    }

    return task;
  }

  async updateTaskById(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const updatedTask = await this.taskRepository.updateTaskById(
      taskId,
      updateTaskDto,
    );
    if (!updatedTask) {
      throw new TaskNotFoundException();
    }

    return updatedTask;
  }

  async deleteTaskById(taskId: string): Promise<void> {
    const deletedTask = await this.taskRepository.deleteTaskById(taskId);
    if (!deletedTask) {
      throw new TaskNotFoundException();
    }
  }
}
