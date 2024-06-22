import { registerAs } from '@nestjs/config';
import { Transform, plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
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

  @Transform(({ value }) => (Number(value) ? Number(value) : 10))
  @IsNumber()
  BCRYPT_SALT: number;
}

export default registerAs('auth', () => {
  const validateConfig = plainToInstance(AuthEnv, process.env);
  const errors = validateSync(validateConfig);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  console.log(validateConfig.BCRYPT_SALT);

  return validateConfig;
});
