export class JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}
