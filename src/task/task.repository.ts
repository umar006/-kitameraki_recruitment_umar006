import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './create-task.dto';
import { TaskMapper } from './task.mapper';
import { Task } from './task.schema';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    const taskObject = await createdTask.save();
    return TaskMapper.toDomain(taskObject);
  }

  async getAllTasks(): Promise<Task[]> {
    const taskList = await this.taskModel.find();
    return taskList.map((taskRaw) => TaskMapper.toDomain(taskRaw));
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    const task = await this.taskModel.findOne({ id: taskId });
    return task ? TaskMapper.toDomain(task) : null;
  }

  async updateTaskById(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task | null> {
    const updatedTask = await this.taskModel.findOneAndUpdate(
      { id: taskId },
      updateTaskDto,
      { new: true },
    );
    return updatedTask ? TaskMapper.toDomain(updatedTask) : null;
  }

  async deleteTaskById(taskId: string): Promise<Task | null> {
    const deletedTask = await this.taskModel.findOneAndDelete({ id: taskId });
    return deletedTask ? TaskMapper.toDomain(deletedTask) : null;
  }
}
