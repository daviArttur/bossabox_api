import { ToolRepositoryStub } from 'test/stub';
import { FindToolsUsecase } from './find-tools';

describe('test FindToolsUsecase', () => {
  let usecase: FindToolsUsecase;

  let spy = {
    'toolRepository.findAll': {} as jest.SpyInstance,
    'toolCacheService.setToolsInCache': {} as jest.SpyInstance,
    'toolCacheService.findTools': {} as jest.SpyInstance,
  };

  beforeEach(() => {
    const repositoryStub = new ToolRepositoryStub().get();

    const cacheServiceStub = {
      findTools: jest.fn(),
      setToolsInCache: jest.fn(),
    };

    spy = {
      'toolRepository.findAll': jest.spyOn(repositoryStub, 'findAll'),
      'toolCacheService.setToolsInCache': jest.spyOn(
        cacheServiceStub,
        'setToolsInCache',
      ),
      'toolCacheService.findTools': jest.spyOn(cacheServiceStub, 'findTools'),
    };

    usecase = new FindToolsUsecase(repositoryStub, cacheServiceStub);
  });

  // Stub

  it('should return the tools of db', async () => {
    // Arrange
    spy['toolCacheService.findTools'].mockResolvedValue(null);
    spy['toolRepository.findAll'].mockResolvedValue({ mock: true });

    // Act
    const result = await usecase.perform();

    // Assert
    expect(result).toEqual({ mock: true });
    expect(spy['toolCacheService.setToolsInCache']).toHaveBeenCalledWith({
      mock: true,
    });
    expect(spy['toolCacheService.findTools']).toHaveBeenCalled();
    expect(spy['toolRepository.findAll']).toHaveBeenCalled();
  });

  it('should return the tools on cache', async () => {
    // Arrange
    spy['toolCacheService.findTools'].mockResolvedValue({
      mock: true,
    });

    // Act
    const result = await usecase.perform();

    // Assert
    expect(result).toEqual({ mock: true });
    expect(spy['toolCacheService.findTools']).toHaveBeenCalledWith();
  });
});
