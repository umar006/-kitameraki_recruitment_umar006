import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskMapper } from './mapper/task.mapper';
import { Task } from './schema/task.schema';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    user: JwtPayload,
  ): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      createdBy: user.id,
    });
    const taskObject = await createdTask.save();
    const rawTask = await taskObject.populate('createdBy');
    return TaskMapper.toDomain(rawTask);
  }

  async getAllTasks(query: QueryTaskDto, user: JwtPayload): Promise<Task[]> {
    const taskList = await this.taskModel
      .find({ createdBy: user.id })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .populate('createdBy');
    return taskList.map((taskRaw) => TaskMapper.toDomain(taskRaw));
  }

  async getTaskById(taskId: string, user: JwtPayload): Promise<Task | null> {
    const task = await this.taskModel
      .findOne({ id: taskId, createdBy: user.id })
      .populate('createdBy');
    return task ? TaskMapper.toDomain(task) : null;
  }

  async updateTaskById(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    user: JwtPayload,
  ): Promise<Task | null> {
    const updatedTask = await this.taskModel.findOneAndUpdate(
      { id: taskId, createdBy: user.id },
      updateTaskDto,
      { new: true },
    );
    return updatedTask ? TaskMapper.toDomain(updatedTask) : null;
  }

  async deleteTaskById(taskId: string, user: JwtPayload): Promise<Task | null> {
    const deletedTask = await this.taskModel.findOneAndDelete({
      id: taskId,
      createdBy: user.id,
    });
    return deletedTask ? TaskMapper.toDomain(deletedTask) : null;
  }
}
