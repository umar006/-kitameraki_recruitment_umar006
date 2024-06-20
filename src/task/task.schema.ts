import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { TaskPriorityEnum, TaskStatusEnum } from './task.enum';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true, default: uuidv4 })
  id: string;

  @Prop({ required: true, maxlength: 100 })
  title: string;

  @Prop({ maxlength: 1000 })
  description?: string;

  @Prop()
  dueDate?: Date;

  @Prop({ type: String, enum: TaskPriorityEnum })
  priority?: TaskPriorityEnum;

  @Prop({ required: true, type: String, enum: TaskStatusEnum })
  status: TaskStatusEnum;

  @Prop({ type: [{ type: String, maxlength: 50 }] })
  tags?: string[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
