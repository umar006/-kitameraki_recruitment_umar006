import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './database.config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (dbCfg: ConfigType<typeof databaseConfig>) => {
        const mongodbUrl = dbCfg.MONGODB_URL;
        const mongodbName = dbCfg.MONGODB_NAME;

        return {
          uri: mongodbUrl,
          dbName: mongodbName,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
