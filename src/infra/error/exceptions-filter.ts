import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export interface HttpExceptionResponse {
  statusCode: number;
  error: string;
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  path: string;
  method: string;
  timeStamp: Date;
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: HttpStatus = response.statusCode;
    let errorMessage: string;

    if (!(exception instanceof HttpException)) {
      response.status(500);
      response.json(
        this.getErrorResponse(
          500,
          'Um erro inesperado aconteceu, tente novamente mais tarde',
          request,
        ),
      );

      return;
    }

    const httpExceptionOrExtestion = exception as HttpException;
    status = httpExceptionOrExtestion.getStatus();
    const errorResponse =
      httpExceptionOrExtestion.getResponse() as HttpExceptionResponse;

    if (status === 400) {
      errorMessage = (errorResponse as any).message; // Get error message of class-validator
    } else {
      errorMessage = errorResponse.error || httpExceptionOrExtestion.message;
    }

    const errorResponseJson = this.getErrorResponse(
      status,
      errorMessage,
      request,
    );

    response.status(status);
    response.json(errorResponseJson);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request,
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timeStamp: new Date(),
  });
}
