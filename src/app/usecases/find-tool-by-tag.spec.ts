import { ToolRepositoryStub } from 'test/stub';
import { FindToolByTagUseCase } from './find-tool-by-tag';

describe('test FindToolByTagUseCase', () => {
  let usecase: FindToolByTagUseCase;

  let spy = {
    'toolRepository.findByTag': {} as jest.SpyInstance,
    'toolCacheService.setToolsInTagCache': {} as jest.SpyInstance,
    'toolCacheService.findToolByTag': {} as jest.SpyInstance,
  };

  beforeEach(() => {
    const repositoryStub = new ToolRepositoryStub().get();

    const cacheServiceStub = {
      findToolByTag: jest.fn(),
      setToolsInTagCache: jest.fn(),
    };

    spy = {
      'toolRepository.findByTag': jest.spyOn(repositoryStub, 'findByTag'),
      'toolCacheService.setToolsInTagCache': jest.spyOn(
        cacheServiceStub,
        'setToolsInTagCache',
      ),
      'toolCacheService.findToolByTag': jest.spyOn(
        cacheServiceStub,
        'findToolByTag',
      ),
    };

    usecase = new FindToolByTagUseCase(repositoryStub, cacheServiceStub);
  });

  // Stub
  const tag = 'tag';

  it('should return the tools on cache', async () => {
    // Arrange
    spy['toolCacheService.findToolByTag'].mockResolvedValue(null);
    spy['toolRepository.findByTag'].mockResolvedValue({ mock: true });

    // Act
    await usecase.perform(tag);

    // Assert
    expect(spy['toolCacheService.setToolsInTagCache']).toHaveBeenCalledWith(
      tag,
      {
        mock: true,
      },
    );
    expect(spy['toolRepository.findByTag']).toHaveBeenCalledWith(tag);
  });

  it('should return the tools of db', async () => {
    // Arrange
    spy['toolCacheService.findToolByTag'].mockResolvedValue({
      mock: true,
    });

    // Act
    const result = await usecase.perform(tag);

    // Assert
    expect(result).toEqual({ mock: true });
    expect(spy['toolCacheService.findToolByTag']).toHaveBeenCalledWith(tag);
  });
});
