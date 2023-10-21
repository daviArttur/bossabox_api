import { Request } from 'express';

export enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface AppRequest extends Request {
  user: TokenPayload;
}

export interface TokenPayload {
  role: RoleEnum;
  sub: number;
}
