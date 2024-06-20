import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }
}
