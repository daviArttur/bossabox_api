import { HttpException } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor() {
    super('Nao autorizado', 403);
  }
}
