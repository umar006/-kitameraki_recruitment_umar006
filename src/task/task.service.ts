import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './create-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.schema';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly taskRepository: TaskRepository,
  ) {}

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
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
