import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Task } from '../schema/task.schema';

export const ApiCreateTaskResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new task' }),
    ApiCreatedResponse({
      type: Task,
      description: 'Success create a new task',
    }),
    ApiBadRequestResponse({ description: 'Validation Error' }),
  );
};

export const ApiGetAllTasksResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Gell all tasks' }),
    ApiOkResponse({
      type: Task,
      isArray: true,
      description: 'Success get all tasks',
    }),
  );
};

export const ApiGetTaskByIdResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get a task by id' }),
    ApiOkResponse({ type: Task, description: 'Success get task' }),
    ApiNotFoundResponse({ description: 'Task Not Found' }),
  );
};

export const ApiUpdateTaskByIdResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update a task by id' }),
    ApiOkResponse({ type: Task, description: 'Success update task' }),
    ApiBadRequestResponse({ description: 'Validation Error' }),
    ApiNotFoundResponse({ description: 'Task Not Found' }),
  );
};

export const ApiDeleteTaskByIdResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a task by id' }),
    ApiNoContentResponse({ description: 'Success delete a task' }),
    ApiNotFoundResponse({ description: 'Task Not Found' }),
  );
};
