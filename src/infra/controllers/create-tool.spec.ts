import { UseCaseStub } from 'test/stub/usecase';
import { CreateToolController } from './create-tool';
import { makeToolStubDto } from 'test/stub';

describe('test CreateToolController', () => {
  let controller: CreateToolController;

  let spy = {
    'usecase.perform': {} as jest.SpyInstance,
  };

  beforeEach(() => {
    const usecaseStub = new UseCaseStub().get();

    spy = {
      'usecase.perform': jest.spyOn(usecaseStub, 'perform'),
    };

    controller = new CreateToolController(usecaseStub);
  });

  // Dto
  const stubDto = makeToolStubDto();

  it('should call usecase.perform() with dto', async () => {
    // Act
    await controller.handle(stubDto);

    // Assert
    expect(spy['usecase.perform']).toHaveBeenCalledWith(stubDto);
  });
});
