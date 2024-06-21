import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMapper } from './mapper/user.mapper';
import { User } from './schema/user.schema';

export class UserRepository {
  constructor(@InjectModel(User.name) private taskModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.taskModel(createUserDto);
    const userObject = await createdUser.save();
    return UserMapper.toDomain(userObject);
  }

  async getUserByEmail(email: string): Promise<User> {
    const userObject = await this.taskModel.findOne({ email: email });
    return userObject ? UserMapper.toDomain(userObject) : null;
  }
}
