import { HttpException } from '@nestjs/common';

export class QueryException extends HttpException {
  constructor() {
    super('Um erro inesperado aconteceu', 500);
  }
}
