import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.schema';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  getAllTasks(query: QueryTaskDto): Promise<Task[]> {
    return this.taskRepository.getAllTasks(query);
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskRepository.getTaskById(taskId);
    if (!task) {
      throw new NotFoundException('task is not found');
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
      throw new NotFoundException('task is not found');
    }

    return updatedTask;
  }

  async deleteTaskById(taskId: string): Promise<void> {
    const deletedTask = await this.taskRepository.deleteTaskById(taskId);
    if (!deletedTask) {
      throw new NotFoundException('task is not found');
    }
  }
}
