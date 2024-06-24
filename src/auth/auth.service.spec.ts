import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await authService.register(registerDto);

      expect(userService.createUser).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should return a JWT token if login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user: User = {
        id: 'testid',
        email: loginDto.email,
        password: 'hashedPassword123',
      };

      const token = 'jwttoken';

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await authService.login(loginDto);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email: user.email,
        id: user.id,
      });
      expect(result).toEqual({ token });
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user: User = {
        id: 'testid',
        email: loginDto.email,
        password: 'hashedPassword123',
      };

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(false));

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.getUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(userService, 'getUserByEmail')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.getUserByEmail).toHaveBeenCalledWith(loginDto.email);
    });
  });
});
