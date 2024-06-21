import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const hashedPwd = await bcrypt.hash(registerDto.password, 10);

    try {
      await this.userService.createUser({
        email: registerDto.email,
        password: hashedPwd,
      });
    } catch (err) {
      console.error(err);
      if (err.code !== null && err.code === 11000) {
        throw new UnprocessableEntityException('email already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
