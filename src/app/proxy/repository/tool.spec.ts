import { ToolRepositoryStub, makeToolStubDto } from 'test/stub';
import { ToolRepositoryProxy } from './tool';
import { Tool } from 'src/domain/entity/tool';

describe('test ToolRepositoryProxy', () => {
  let proxy: ToolRepositoryProxy;

  let spy = {
    'toolRepository.save': {} as jest.SpyInstance,
    'toolCacheService.setToolsInCache': {} as jest.SpyInstance,
    'toolCacheService.setToolsInTagCache': {} as jest.SpyInstance,
  };

  beforeEach(() => {
    const repositoryStub = new ToolRepositoryStub().get();

    const cacheServiceStub = {
      setToolsInCache: jest.fn(),
      setToolsInTagCache: jest.fn(),
    } as any;

    spy = {
      'toolRepository.save': jest.spyOn(repositoryStub, 'save'),
      'toolCacheService.setToolsInTagCache': jest.spyOn(
        cacheServiceStub,
        'setToolsInTagCache',
      ),
      'toolCacheService.setToolsInCache': jest.spyOn(
        cacheServiceStub,
        'setToolsInCache',
      ),
    };

    proxy = new ToolRepositoryProxy(repositoryStub, cacheServiceStub);
  });

  it('should save tool in repository and in cache service', async () => {
    // Arrange
    const tool = new Tool(makeToolStubDto());
    spy['toolRepository.save'].mockResolvedValue(tool);

    // Act
    await proxy.save(tool);

    // Assert
    expect(spy['toolRepository.save']).toHaveBeenCalledWith(tool);
    expect(spy['toolCacheService.setToolsInCache']).toHaveBeenCalledWith([
      tool,
    ]);
    for (let i = 1; i <= tool.tags.length; i++) {
      const tag = tool.tags[i - 1];
      expect(
        spy['toolCacheService.setToolsInTagCache'],
      ).toHaveBeenNthCalledWith(i, tag, [tool]);
    }
  });
});
