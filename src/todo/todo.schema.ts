import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/user.schema';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  is_finished: boolean;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  created_by: User;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
