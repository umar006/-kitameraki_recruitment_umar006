import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Task } from '../schema/task.schema';

export const ApiCreateTaskResponse = () => {
  return applyDecorators(
    ApiCreatedResponse({
      type: Task,
      description: 'Success create a new task',
    }),
    ApiBadRequestResponse({ description: 'Validation Error' }),
  );
};

export const ApiGetAllTasksResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      type: Task,
      isArray: true,
      description: 'Success get all tasks',
    }),
  );
};

export const ApiGetTaskByIdResponse = () => {
  return applyDecorators(
    ApiOkResponse({ type: Task, description: 'Success get task' }),
    ApiNotFoundResponse({ description: 'Task Not Found' }),
  );
};

export const ApiUpdateTaskByIdResponse = () => {
  return applyDecorators(
    ApiOkResponse({ type: Task, description: 'Success update task' }),
    ApiBadRequestResponse({ description: 'Validation Error' }),
    ApiNotFoundResponse({ description: 'Task Not Found' }),
  );
};

export const ApiDeleteTaskByIdResponse = () => {
  return applyDecorators(
    ApiNoContentResponse({ description: 'Success delete a task' }),
    ApiNotFoundResponse({ description: 'Task Not Found' }),
  );
};
