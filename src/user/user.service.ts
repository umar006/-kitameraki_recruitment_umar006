import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPwd = await bcrypt.hash(createUserDto.password, 10);

    try {
      const createdUser = await this.userRepository.createUser({
        ...createUserDto,
        password: hashedPwd,
      });

      return createdUser;
    } catch (err) {
      console.error(err);
      if (err.code !== null && err.code === 11000) {
        throw new UnprocessableEntityException('email already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
