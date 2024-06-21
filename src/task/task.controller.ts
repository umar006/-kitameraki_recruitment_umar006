import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { QueryTaskDto } from './query-task.dto';
import { Task } from './task.schema';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const resp = await this.taskService.createTask(createTaskDto);
    return resp;
  }

  @Get()
  async getTaskList(@Query() query: QueryTaskDto): Promise<Task[]> {
    const resp = await this.taskService.getAllTasks(query);
    return resp;
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    const resp = await this.taskService.getTaskById(id);
    return resp;
  }

  @Patch(':id')
  async updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const resp = await this.taskService.updateTaskById(id, updateTaskDto);
    return resp;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTaskById(@Param('id') id: string): Promise<void> {
    await this.taskService.deleteTaskById(id);
  }
}
