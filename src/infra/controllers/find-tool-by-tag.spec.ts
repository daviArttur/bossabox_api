import { UseCaseStub } from 'test/stub/usecase';
import { FindByTagController } from './find-tool-by-tag';

describe('test FindByTagController', () => {
  let controller: FindByTagController;

  let spy = {
    'usecase.perform': {} as jest.SpyInstance,
  };

  beforeEach(() => {
    const usecaseStub = new UseCaseStub().get();

    spy = {
      'usecase.perform': jest.spyOn(usecaseStub, 'perform'),
    };

    controller = new FindByTagController(usecaseStub);
  });

  it('should call usecase.perform() with dto', async () => {
    // Act
    await controller.handle('');

    // Assert
    expect(spy['usecase.perform']).toHaveBeenCalledWith('');
  });
});
