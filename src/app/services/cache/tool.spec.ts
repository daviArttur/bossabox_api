import { ToolCacheService } from './tool';

describe('test ToolCacheService', () => {
  let service: ToolCacheService;

  let spy = {
    'cache.get': {} as jest.SpyInstance,
    'cache.set': {} as jest.SpyInstance,
  };

  beforeEach(() => {
    const adapterStub = {
      get: jest.fn(),
      set: jest.fn(),
    };

    spy = {
      'cache.set': jest.spyOn(adapterStub, 'set'),
      'cache.get': jest.spyOn(adapterStub, 'get'),
    };

    service = new ToolCacheService(adapterStub);
  });

  describe('findTools()', () => {
    it('should find tools in cache', async () => {
      // Arrange
      spy['cache.get'].mockResolvedValue([{ mock: true }]);

      // Act
      const tools = await service.findTools();

      // Assert
      expect(tools).toEqual([{ mock: true }]);
      expect(spy['cache.get']).toHaveBeenLastCalledWith('tools');
    });
  });

  describe('findToolByTag()', () => {
    it('should find tools in cache', async () => {
      // Stub
      const tag = 'tag';
      // Arrange
      spy['cache.get'].mockResolvedValue([{ mock: true }]);

      // Act
      const tools = await service.findToolByTag(tag);

      // Assert
      expect(tools).toEqual([{ mock: true }]);
      expect(spy['cache.get']).toHaveBeenLastCalledWith(`tool_tag_${tag}`);
    });
  });

  describe('setToolsInCache()', () => {
    it('should set tools in cache', async () => {
      // Act
      await service.setToolsInCache([]);

      // Assert
      expect(spy['cache.set']).toHaveBeenLastCalledWith('tools', []);
    });
  });

  describe('setToolsInTagCache()', () => {
    it('should set tools in cache', async () => {
      // Stub
      const tag = 'tag';
      // Act
      await service.setToolsInTagCache(tag, []);

      // Assert
      expect(spy['cache.set']).toHaveBeenLastCalledWith(`tool_tag_${tag}`, []);
    });
  });
});
