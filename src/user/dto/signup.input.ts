import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpInput {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
