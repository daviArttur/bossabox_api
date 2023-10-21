import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { UnauthorizedException } from 'src/app/error/unauthorized';
import { AppRequest, RoleEnum } from 'src/infra/interfaces';

export class RoleInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = this.getRequest(context);

    if (request.user.role !== RoleEnum.ADMIN) {
      throw new UnauthorizedException();
    }

    return next.handle();
  }

  getResponse(context: ExecutionContext) {
    return context.switchToHttp().getResponse();
  }

  getRequest(context: ExecutionContext): AppRequest {
    return context.switchToHttp().getRequest();
  }
}
