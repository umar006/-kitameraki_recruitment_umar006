import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import authConfig from '../auth/auth.config';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const mockUserRepo = {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockAuthCfg = {
    BCRYPT_SALT: 1,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUserRepo,
        },
        {
          provide: authConfig.KEY,
          useValue: mockAuthCfg,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPwd = 'hashedPassword123';
      const createdUser: User = {
        ...createUserDto,
        password: hashedPwd,
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(() => Promise.resolve(hashedPwd));
      jest.spyOn(userRepository, 'createUser').mockResolvedValue(createdUser);

      const result = await userService.createUser(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        createUserDto.password,
        mockAuthCfg.BCRYPT_SALT,
      );
      expect(userRepository.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPwd,
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw UnprocessableEntityException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(() => Promise.resolve('hashedPassword123'));
      jest
        .spyOn(userRepository, 'createUser')
        .mockRejectedValue({ code: 11000 });

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(userRepository.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword123',
      });
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const user: User = {
        email,
        password: 'hashedPassword123',
      };

      jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(user);

      const result = await userService.getUserByEmail(email);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'test@example.com';

      jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(null);

      await expect(userService.getUserByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(email);
    });
  });
});
