import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  let loginDto: LoginDto;

  beforeEach(() => {
    loginDto = new LoginDto();
  });

  it('should validate a correct login dto', async () => {
    loginDto.email = 'test@mail.com';
    loginDto.password = 'testpassword';

    const errors = await validate(loginDto);
    expect(errors.length).toBe(0);
  });

  it('should fail if email is empty', async () => {
    loginDto.email = '';
    loginDto.password = 'testpassword';

    const errors = await validate(loginDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if email is not email', async () => {
    loginDto.email = 'testnotemail';
    loginDto.password = 'testpassword';

    const errors = await validate(loginDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });

  it('should fail if password is empty', async () => {
    loginDto.email = 'test@mail.com';
    loginDto.password = '';

    const errors = await validate(loginDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if password is not string', async () => {
    loginDto.email = 'test@mail.com';
    loginDto.password = 1234 as unknown as string;

    const errors = await validate(loginDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });
});
