import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './create-task.dto';
import { TaskMapper } from './task.mapper';
import { Task } from './task.schema';
import { UpdateTaskDto } from './update-task.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly taskRepository: TaskRepository,
  ) {}

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async getAllTasks(): Promise<Task[]> {
    const taskList = await this.taskModel.find();
    return taskList.map((taskRaw) => TaskMapper.toDomain(taskRaw));
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ id: taskId });
    if (!task) {
      throw new NotFoundException('task is not found');
    }

    return TaskMapper.toDomain(task);
  }

  async updateTaskById(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<void> {
    const updatedTask = await this.taskModel.findOneAndUpdate(
      { id: taskId },
      updateTaskDto,
    );
    if (!updatedTask) {
      throw new NotFoundException('task is not found');
    }
  }

  async deleteTaskById(taskId: string): Promise<void> {
    const deletedTask = await this.taskModel.findOneAndDelete({ id: taskId });
    if (!deletedTask) {
      throw new NotFoundException('task is not found');
    }
  }
}
