import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

export const ApiRegisterResponse = () => {
  return applyDecorators(
    ApiNoContentResponse({ description: 'Success register user' }),
    ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' }),
  );
};
