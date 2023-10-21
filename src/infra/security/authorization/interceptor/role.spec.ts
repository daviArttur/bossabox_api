import { AppRequest, RoleEnum } from 'src/infra/interfaces';
import { RoleInterceptor } from './role';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from 'src/app/error/unauthorized';

describe('test RoleInterceptor', () => {
  let interceptor: RoleInterceptor;

  let spy = {
    'next.handle': {} as jest.SpyInstance,
  };

  let authRequest: AppRequest;

  let executionContext: ExecutionContext;

  let callHandler: CallHandler;

  beforeEach(() => {
    authRequest = {
      user: {
        role: RoleEnum.ADMIN,
      },
    } as unknown as AppRequest;

    executionContext = {
      switchToHttp: () => ({
        getRequest: () => authRequest,
      }),
    } as unknown as ExecutionContext;

    callHandler = {
      handle: jest.fn(),
    } as CallHandler;

    spy = {
      'next.handle': jest.spyOn(callHandler, 'handle'),
    };
    interceptor = new RoleInterceptor();
  });
  it('should call next.handle() because user is admin', async () => {
    // Act
    await interceptor.intercept(executionContext, callHandler);

    // Assert
    expect(spy['next.handle']).toHaveBeenCalled();
  });
  it('should throw UnauthorizedException because user not is admin', async () => {
    // Arrange
    authRequest.user.role = RoleEnum.USER;

    // Assert
    expect(
      interceptor.intercept(executionContext, callHandler),
    ).rejects.toThrow(UnauthorizedException);
  });
});
