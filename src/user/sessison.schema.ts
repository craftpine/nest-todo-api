import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/user.schema';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
