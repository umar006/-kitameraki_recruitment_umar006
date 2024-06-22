import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let createUserDto: CreateUserDto;

  beforeEach(() => {
    createUserDto = new CreateUserDto();
  });

  it('should validate a correct create user dto', async () => {
    createUserDto.email = 'test@mail.com';
    createUserDto.password = 'testpassword';

    const errors = await validate(createUserDto);
    expect(errors.length).toBe(0);
  });

  it('should fail if email is empty', async () => {
    createUserDto.email = '';
    createUserDto.password = 'testpassword';

    const errors = await validate(createUserDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if email is not email', async () => {
    createUserDto.email = 'testnotemail';
    createUserDto.password = 'testpassword';

    const errors = await validate(createUserDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });

  it('should fail if password is empty', async () => {
    createUserDto.email = 'test@mail.com';
    createUserDto.password = '';

    const errors = await validate(createUserDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if password is not string', async () => {
    createUserDto.email = 'test@mail.com';
    createUserDto.password = 1234 as unknown as string;

    const errors = await validate(createUserDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });
});
