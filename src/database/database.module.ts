import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './database.config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (config: ConfigType<typeof databaseConfig>) => {
        const mongodbUrl = config.MONGODB_URL;

        return {
          uri: mongodbUrl,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
