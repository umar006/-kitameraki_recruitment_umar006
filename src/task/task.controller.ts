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
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schema/task.schema';
import {
  ApiCreateTaskResponse,
  ApiDeleteTaskByIdResponse,
  ApiGetAllTasksResponse,
  ApiGetTaskByIdResponse,
  ApiUpdateTaskByIdResponse,
} from './swagger/custom-decorator.swagger';
import { TaskService } from './task.service';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiCreateTaskResponse()
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const resp = await this.taskService.createTask(createTaskDto);
    return resp;
  }

  @ApiGetAllTasksResponse()
  @Get()
  async getTaskList(@Query() query: QueryTaskDto): Promise<Task[]> {
    const resp = await this.taskService.getAllTasks(query);
    return resp;
  }

  @ApiGetTaskByIdResponse()
  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    const resp = await this.taskService.getTaskById(id);
    return resp;
  }

  @ApiUpdateTaskByIdResponse()
  @Patch(':id')
  async updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const resp = await this.taskService.updateTaskById(id, updateTaskDto);
    return resp;
  }

  @ApiDeleteTaskByIdResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTaskById(@Param('id') id: string): Promise<void> {
    await this.taskService.deleteTaskById(id);
  }
}
