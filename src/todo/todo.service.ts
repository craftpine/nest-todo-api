import { CreateTodoInput } from './dto/create-todo.input';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { User } from 'src/user/user.schema';
import { UpdateTodoInput } from './dto/update-todo.input';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
  ) {}

  async getAllTodo() {
    return this.todoModel.find({}).populate({
      path: 'created_by',
      model: User.name,
      select: ['username', '_id'],
    });
  }

  async createTodo(createTodoInput: CreateTodoInput) {
    return this.todoModel.create(createTodoInput);
  }

  async updateTodo(udpateTodoInput: UpdateTodoInput) {
    return this.todoModel.findOneAndUpdate(
      { _id: udpateTodoInput._id },
      { ...udpateTodoInput },
    );
  }
}
