import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../user/schema/user.schema';
import { TaskPriorityEnum, TaskStatusEnum } from './../task.enum';

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  createdBy: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
