import { IsInt, IsNumber, Min } from 'class-validator';
import { User } from 'src/user/user.schema';

export class GetTodoInput {
  @IsInt()
  @Min(0)
  page?: number;
}
