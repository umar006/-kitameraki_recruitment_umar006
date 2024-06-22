import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Task } from '../schema/task.schema';

export const ApiCreateTaskResponse = () => {
  return applyDecorators(
    ApiCreatedResponse({
      type: Task,
      description: 'Success create a new task',
    }),
    ApiBadRequestResponse({ description: 'Validation Error' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};

export const ApiGetAllTasksResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      type: Task,
      isArray: true,
      description: 'Success get all tasks',
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};

export const ApiGetTaskByIdResponse = () => {
  return applyDecorators(
    ApiOkResponse({ type: Task, description: 'Success get task' }),
    ApiNotFoundResponse({ description: 'Task Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};

export const ApiUpdateTaskByIdResponse = () => {
  return applyDecorators(
    ApiOkResponse({ type: Task, description: 'Success update task' }),
    ApiBadRequestResponse({ description: 'Validation Error' }),
    ApiNotFoundResponse({ description: 'Task Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};

export const ApiDeleteTaskByIdResponse = () => {
  return applyDecorators(
    ApiNoContentResponse({ description: 'Success delete a task' }),
    ApiNotFoundResponse({ description: 'Task Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
