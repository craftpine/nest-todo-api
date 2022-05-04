import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTodoInput {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  _id: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  is_finished?: boolean;
}
