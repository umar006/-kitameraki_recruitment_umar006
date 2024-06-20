import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { Task } from './task.schema';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    await this.taskService.createTask(createTaskDto);
  }

  @Get()
  async getTaskList(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }
}
