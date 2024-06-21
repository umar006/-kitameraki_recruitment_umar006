import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  validateSync,
} from 'class-validator';

class AuthEnv {
  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsNumberString()
  JWT_EXPIRES_IN_HOUR: string;
}

export default registerAs('auth', () => {
  const validateConfig = plainToInstance(AuthEnv, process.env);
  const errors = validateSync(validateConfig);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validateConfig;
});
