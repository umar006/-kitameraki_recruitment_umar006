import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  let registerDto: RegisterDto;

  beforeEach(() => {
    registerDto = new RegisterDto();
  });

  it('should validate a correct register dto', async () => {
    registerDto.email = 'test@mail.com';
    registerDto.password = 'testpassword';

    const errors = await validate(registerDto);
    expect(errors.length).toBe(0);
  });

  it('should fail if email is empty', async () => {
    registerDto.email = '';
    registerDto.password = 'testpassword';

    const errors = await validate(registerDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if email is not email', async () => {
    registerDto.email = 'testnotemail';
    registerDto.password = 'testpassword';

    const errors = await validate(registerDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });

  it('should fail if password is empty', async () => {
    registerDto.email = 'test@mail.com';
    registerDto.password = '';

    const errors = await validate(registerDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if password is not string', async () => {
    registerDto.email = 'test@mail.com';
    registerDto.password = 1234 as unknown as string;

    const errors = await validate(registerDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });
});
