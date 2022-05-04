import { CreateTodoInput } from './dto/create-todo.input';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { User } from 'src/user/user.schema';
import { UpdateTodoInput } from './dto/update-todo.input';
import { GetTodoInput } from './dto/get-all-todo.input';
import { count } from 'console';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
  ) {}

  async getAllTodo(page: GetTodoInput, userId: string) {
    const skip = Number(Number(page) - 1) * 10;
    const data = await this.todoModel
      .find({
        created_by: userId,
      })
      .populate({
        path: 'created_by',
        model: User.name,
        select: ['username', '_id'],
      })
      .skip(skip)
      .limit(10)
      .sort({ created_at: 1 });
    const count = await this.todoModel.find({}).count();
    return {
      data,
      count,
    };
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

  async deleteTodo(id: string) {
    return await this.todoModel.findByIdAndDelete(id);
  }
}
