import { User, UserDocument } from './user.schema';
import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpInput } from './dto/signup.input';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { Session, SessionDocument } from './sessison.schema';

@Injectable({})
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async getAllUser() {
    const data = await this.userModel.find({}).select({
      username: 1,
    });
    return data;
  }

  async login(signInInput: SignUpInput) {
    //find user by username
    const user = await this.findUser(signInInput.username);

    if (!user) throw new ForbiddenException('Credential incorrect');

    // compare password
    const pwMatches = await argon.verify(user.password, signInInput.password);

    if (!pwMatches) throw new ForbiddenException('Credential incorrect');

    // create session
    const session = await this.createSession(user._id);
    // create access token
    const accessToken = await this.createAccessToken(user, session);

    // create refresh token
    const refreshToken = await this.jwt.sign(session, {
      expiresIn: this.config.get('EXPRIRESINRFT'),
      secret: this.config.get('JWT_SECRET'),
    });

    // send back user
    return { accessToken, refreshToken };
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
        // return this.signToken(newUser._id, newUser.username);
        delete newUser.password;
        return newUser;
      }
    } catch (error) {
      throw error;
    }
  }

  async createAccessToken(user: any, session: any): Promise<string> {
    const payload = {
      ...user,
      session: session._id,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('EXPRIRESIN'),
      secret: this.config.get('JWT_SECRET'),
    });

    return token;
  }

  async createSession(userId: string) {
    const data = await this.sessionModel.create({
      user: userId,
      valid: true,
    });
    return data.toJSON();
  }

  async reIssueAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_SECRET'),
      });
      if (!decoded._id) return false;

      // get session
      const session = await this.sessionModel.findById(decoded._id);

      const user = await this.userModel.findById(decoded.user);

      if (!user) return false;

      const accessToken = this.createAccessToken(user, session);

      return accessToken;
    } catch (error) {
      const decoded: any = this.jwt.decode(refreshToken);
      await this.sessionModel.deleteOne({ _id: decoded._id });
      throw new UnprocessableEntityException('Refresh token expired');
    }
  }

  async findUser(username: string) {
    return this.userModel.findOne({ username });
  }
}
