import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class DatabaseEnv {
  @IsString()
  @IsNotEmpty()
  MONGODB_URL: string;
}

export default registerAs('database', () => {
  const validatedConfig = plainToInstance(DatabaseEnv, process.env);
  const errors = validateSync(validatedConfig);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
});
