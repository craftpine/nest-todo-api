import { CreateTodoInput } from './dto/create-todo.input';
import { TodoService } from './todo.service';
import { JwtGuard } from './../user/guard/jwt.guard';
import { Controller, UseGuards, Get, Post, Body } from '@nestjs/common';
import { GetCurrentUser } from 'src/user/decorator/get-current-user.decorator';

@UseGuards(JwtGuard)
@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async getTodos() {
    return this.todoService.getAllTodo();
  }

  @Post()
  async createTodo(
    @Body() dto: CreateTodoInput,
    @GetCurrentUser('userId') userId: any,
  ) {
    return this.todoService.createTodo({ ...dto, created_by: userId });
  }
}
