import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskMapper } from './mapper/task.mapper';
import { Task } from './schema/task.schema';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      createdBy: user.id,
    });
    const taskObject = await createdTask.save();
    return TaskMapper.toDomain(taskObject);
  }

  async getAllTasks(query: QueryTaskDto): Promise<Task[]> {
    const taskList = await this.taskModel
      .find()
      .skip((query.page - 1) * query.limit)
      .limit(query.limit);
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
