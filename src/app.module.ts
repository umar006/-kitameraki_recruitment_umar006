import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/database.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env'],
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
