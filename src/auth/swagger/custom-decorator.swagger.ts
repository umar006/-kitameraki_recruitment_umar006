import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';
import { MyHttpException } from 'src/common/exception/my-http.exception';

export const ApiRegisterResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiNoContentResponse({ description: 'Success register user' }),
    ApiUnprocessableEntityResponse({
      type: MyHttpException,
      description: 'Unprocessable Entity',
    }),
  );
};

export const ApiLoginResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiOkResponse({
      type: LoginResponseDto,
      description: 'Success login user',
    }),
    ApiUnauthorizedResponse({
      type: MyHttpException,
      description: 'Unauthorized',
    }),
  );
};

export const ApiLogoutResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Logout user' }),
    ApiNoContentResponse({ description: 'Success logout user' }),
    ApiUnauthorizedResponse({
      type: MyHttpException,
      description: 'Unauthorized',
    }),
  );
};
