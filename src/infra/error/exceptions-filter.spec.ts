import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { ExceptionsFilter } from './exceptions-filter';
import { QueryException } from 'src/app/error/query';

describe('test ExceptionsFilter', () => {
  let exceptionFilter: ExceptionFilter;

  let spy = {
    'ctx.getResponse': {} as jest.SpyInstance,
    'ctx.getRequest': {} as jest.SpyInstance,
  };

  let switchToHttpStub: ArgumentsHost;

  beforeAll(() => {
    jest.useFakeTimers({ now: new Date() });
  });

  beforeEach(() => {
    const getStub = {
      getResponse: jest.fn(),
      getRequest: jest.fn(),
    };

    switchToHttpStub = {
      switchToHttp: () => getStub,
    } as any;

    spy = {
      'ctx.getResponse': jest.spyOn(getStub, 'getResponse'),
      'ctx.getRequest': jest.spyOn(getStub, 'getRequest'),
    };

    exceptionFilter = new ExceptionsFilter();
  });

  it('should throw status 500 with static message', () => {
    // Arrange
    const statusFnStub = jest.fn();
    const jsonFnStub = jest.fn();
    //const jsonFnSpy = jest.spyOn(jsonFnStub)
    //const statusFnSpy = jest.spyOn()

    spy['ctx.getResponse'].mockReturnValue({
      statusCode: 200,
      status: statusFnStub,
      json: jsonFnStub,
    });

    spy['ctx.getRequest'].mockReturnValue({
      url: 'http',
      method: 'GET',
    });

    // Act
    exceptionFilter.catch(new Error(), switchToHttpStub);

    // Assert
    expect(spy['ctx.getRequest']).toHaveBeenCalled();
    expect(spy['ctx.getResponse']).toHaveBeenCalled();
    expect(statusFnStub).toHaveBeenCalledWith(500);
    expect(jsonFnStub).toHaveBeenCalledWith({
      error: 'Um erro inesperado aconteceu, tente novamente mais tarde',
      method: 'GET',
      path: 'http',
      statusCode: 500,
      timeStamp: new Date(),
    });
  });

  it('should return response with HttpException data', () => {
    // Arrange
    const statusFnStub = jest.fn();
    const jsonFnStub = jest.fn();
    //const jsonFnSpy = jest.spyOn(jsonFnStub)
    //const statusFnSpy = jest.spyOn()

    spy['ctx.getResponse'].mockReturnValue({
      statusCode: 200,
      status: statusFnStub,
      json: jsonFnStub,
    });

    spy['ctx.getRequest'].mockReturnValue({
      url: 'http',
      method: 'GET',
    });

    // Act
    exceptionFilter.catch(
      new HttpException('test_message', 422),
      switchToHttpStub,
    );

    // Assert
    expect(statusFnStub).toHaveBeenCalledWith(422);
    expect(jsonFnStub).toHaveBeenCalledWith({
      error: 'test_message',
      method: 'GET',
      path: 'http',
      statusCode: 422,
      timeStamp: new Date(),
    });
  });

  it('should return response with HttpException QueryExceptiona', () => {
    // Arrange
    const statusFnStub = jest.fn();
    const jsonFnStub = jest.fn();

    spy['ctx.getResponse'].mockReturnValue({
      statusCode: 200,
      status: statusFnStub,
      json: jsonFnStub,
    });

    spy['ctx.getRequest'].mockReturnValue({
      url: 'http',
      method: 'GET',
    });

    // Act
    exceptionFilter.catch(new QueryException(), switchToHttpStub);

    // Assert
    expect(statusFnStub).toHaveBeenCalledWith(new QueryException().getStatus());
    expect(jsonFnStub).toHaveBeenCalledWith({
      error: new QueryException().message,
      method: 'GET',
      path: 'http',
      statusCode: new QueryException().getStatus(),
      timeStamp: new Date(),
    });
  });
});
