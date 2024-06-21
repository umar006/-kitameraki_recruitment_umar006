import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { Task, TaskSchema } from './task.schema';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TaskService, TaskRepository],
  controllers: [TaskController],
})
export class TaskModule {}
