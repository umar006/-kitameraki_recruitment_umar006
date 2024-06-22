import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import authConfig from '../auth/auth.config';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(authConfig.KEY)
    private authCfg: ConfigType<typeof authConfig>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const bcryptSalt = this.authCfg.BCRYPT_SALT;
    const hashedPwd = await bcrypt.hash(createUserDto.password, bcryptSalt);

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

  async getUserByEmail(userId: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(userId);
    if (!user) {
      throw new NotFoundException('user is not found');
    }

    return user;
  }
}
