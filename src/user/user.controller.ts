import { SignUpInput } from './dto/signup.input';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return this.userService.getAllUser();
  }

  @Post()
  async signUp(@Body() dto: SignUpInput) {
    return this.userService.signUp(dto);
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignUpInput) {
    return this.userService.login(dto);
  }
}
