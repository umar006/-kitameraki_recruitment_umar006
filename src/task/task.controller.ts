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
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schema/task.schema';
import { ApiCreateTaskResponse } from './swagger/custom-decorator.swagger';
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

  @ApiOkResponse({
    type: Task,
    isArray: true,
    description: 'Success get all tasks',
  })
  @Get()
  async getTaskList(@Query() query: QueryTaskDto): Promise<Task[]> {
    const resp = await this.taskService.getAllTasks(query);
    return resp;
  }

  @ApiOkResponse({ type: Task, description: 'Success get task' })
  @ApiNotFoundResponse({ description: 'Task Not Found' })
  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    const resp = await this.taskService.getTaskById(id);
    return resp;
  }

  @ApiOkResponse({ type: Task, description: 'Success update task' })
  @ApiBadRequestResponse({ description: 'Validation Error' })
  @ApiNotFoundResponse({ description: 'Task Not Found' })
  @Patch(':id')
  async updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const resp = await this.taskService.updateTaskById(id, updateTaskDto);
    return resp;
  }

  @ApiNoContentResponse({ description: 'Success delete a task' })
  @ApiNotFoundResponse({ description: 'Task Not Found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTaskById(@Param('id') id: string): Promise<void> {
    await this.taskService.deleteTaskById(id);
  }
}
