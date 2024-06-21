import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './create-task.dto';
import { TaskMapper } from './task.mapper';
import { Task } from './task.schema';

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
}
