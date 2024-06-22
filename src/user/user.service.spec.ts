import { UnprocessableEntityException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
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

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUserRepo,
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

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
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
});
