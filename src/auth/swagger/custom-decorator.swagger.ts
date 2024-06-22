import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';

export const ApiRegisterResponse = () => {
  return applyDecorators(
    ApiNoContentResponse({ description: 'Success register user' }),
    ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' }),
  );
};

export const ApiLoginResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      type: LoginResponseDto,
      description: 'Success login user',
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
