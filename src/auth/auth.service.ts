import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    await this.userService.createUser(registerDto);
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    let user: User;
    try {
      user = await this.userService.getUserByEmail(loginDto.email);
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException();
      }
      throw new InternalServerErrorException();
    }

    const comparePwd = await bcrypt.compare(loginDto.password, user.password);
    if (!comparePwd) {
      throw new UnauthorizedException();
    }

    const jwtPayload = {
      id: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(jwtPayload);

    return { token };
  }
}
