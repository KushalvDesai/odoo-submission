import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async register(name: string, email: string, password: string): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({ name, email, password: hashed });
    return createdUser.save();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<string> {
    return this.jwtService.sign({ sub: (user as any)._id, name: user.name, email: user.email });
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);
      return this.userModel.findById(payload.sub);
    } catch {
      return null;
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
} 