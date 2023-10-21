import { RedisAdapter } from './redis';

describe('test RedisAdapter', () => {
  let adapter: RedisAdapter;

  let spy = {
    'client.get': {} as jest.SpyInstance,
    'client.set': {} as jest.SpyInstance,
  };

  beforeEach(() => {
    const redisClient = {
      set: jest.fn(),
      get: jest.fn(),
    } as any;

    spy = {
      'client.get': jest.spyOn(redisClient, 'get'),
      'client.set': jest.spyOn(redisClient, 'set'),
    };

    adapter = new RedisAdapter(redisClient);
  });

  describe('test get()', () => {
    it('should get data and return data because it exist', async () => {
      // Arrange
      spy['client.get'].mockResolvedValue(JSON.stringify({ mock: true }));

      // Act
      const data = await adapter.get('key');

      // Assert
      expect(data).toEqual({ mock: true });
      expect(spy['client.get']).toHaveBeenCalledWith('key');
    });
    it('should get data and return null because it does not exist', async () => {
      // Arrange
      spy['client.get'].mockResolvedValue(null);

      // Act
      const data = await adapter.get('key');

      // Assert
      expect(data).toBeNull();
      expect(spy['client.get']).toHaveBeenCalledWith('key');
    });
  });

  it('should set data', async () => {
    //

    await adapter.set('a', {});

    // Assert
    expect(spy['client.set']).toHaveBeenCalledWith('a', JSON.stringify({}));
  });
});
