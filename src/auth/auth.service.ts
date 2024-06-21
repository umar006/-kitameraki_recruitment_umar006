import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const hashedPwd = await bcrypt.hash(registerDto.password, 10);

    await this.userService.createUser({
      email: registerDto.email,
      password: hashedPwd,
    });
  }
}
