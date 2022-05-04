import { CreateTodoInput } from './dto/create-todo.input';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { User } from 'src/user/user.schema';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
  ) {}

  async getAllTodo() {
    return this.todoModel.find({}).populate('created_by', null, User.name);
  }

  async createTodo(createTodoInput: CreateTodoInput) {
    return this.todoModel.create(createTodoInput);
  }
}
