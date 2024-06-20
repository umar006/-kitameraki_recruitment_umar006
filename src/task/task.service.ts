import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './create-task.dto';
import { Task } from './task.schema';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return await createdTask.save();
  }

  async getAllTasks(): Promise<Task[]> {
    const taskList = await this.taskModel.find();
    return taskList;
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ id: taskId });
    if (!task) {
      throw new NotFoundException('task is not found');
    }

    return task;
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
