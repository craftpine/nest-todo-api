import { User, UserDocument } from './user.schema';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpInput } from './dto/signup.input';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

@Injectable({})
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async getAllUser() {
    const data = await this.userModel.find({});
    return data;
  }

  async login(signInInput: SignUpInput) {
    //find user by username
    const user = await this.findUser(signInInput.username);

    if (!user) throw new ForbiddenException('Credential incorrect');

    // compare password
    const pwMatches = await argon.verify(user.password, signInInput.password);

    if (!pwMatches) throw new ForbiddenException('Credential incorrect');

    // send back user
    return this.signToken(user.id, user.username);
  }

  async signUp(signUpInput: SignUpInput) {
    try {
      const user = await this.findUser(signUpInput.username);

      if (user) {
        throw new ForbiddenException('Credential taken');
      } else {
        const hash = await argon.hash(signUpInput.password);
        const newUser = await this.userModel.create({
          ...signUpInput,
          password: hash,
        });
        return this.signToken(newUser._id, newUser.username);
      }
    } catch (error) {
      throw error;
    }
  }

  async signToken(
    userId: number,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      username,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }

  async findUser(username: string) {
    return this.userModel.findOne({ username });
  }
}
