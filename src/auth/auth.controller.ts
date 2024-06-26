import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtGuard } from './guard/jwt.guard';
import {
  ApiLoginResponse,
  ApiLogoutResponse,
  ApiRegisterResponse,
} from './swagger/custom-decorator.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiRegisterResponse()
  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.register(registerDto);
  }

  @ApiLoginResponse()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<LoginResponseDto> {
    const resp = await this.authService.login(loginDto);

    response.cookie('Authentication', resp.token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    response.send(resp);

    return resp;
  }

  @ApiLogoutResponse()
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res() response: Response): Promise<void> {
    response.clearCookie('Authentication');

    response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
