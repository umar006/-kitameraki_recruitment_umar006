import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskNotFoundException } from './exception/task-not-found.exception';
import { Task } from './schema/task.schema';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  createTask(createTaskDto: CreateTaskDto, user: JwtPayload): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  getAllTasks(query: QueryTaskDto, user: JwtPayload): Promise<Task[]> {
    return this.taskRepository.getAllTasks(query, user);
  }

  async getTaskById(taskId: string, user: JwtPayload): Promise<Task> {
    const task = await this.taskRepository.getTaskById(taskId, user);
    if (!task) {
      throw new TaskNotFoundException();
    }

    return task;
  }

  async updateTaskById(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    user: JwtPayload,
  ): Promise<Task> {
    const updatedTask = await this.taskRepository.updateTaskById(
      taskId,
      updateTaskDto,
      user,
    );
    if (!updatedTask) {
      throw new TaskNotFoundException();
    }

    return updatedTask;
  }

  async deleteTaskById(taskId: string, user: JwtPayload): Promise<void> {
    const deletedTask = await this.taskRepository.deleteTaskById(taskId, user);
    if (!deletedTask) {
      throw new TaskNotFoundException();
    }
  }
}
