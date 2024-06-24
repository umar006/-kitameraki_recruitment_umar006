import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('you have not login');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request['user'] = payload;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('jwt malformed or expired');
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | null {
    const token = request.cookies['Authentication'];
    return token ? token : null;
  }
}
