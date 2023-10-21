import { CacheAdapter } from 'src/app/services/cache/tool';
import { Redis } from 'ioredis';

export class RedisAdapter implements CacheAdapter {
  constructor(private client: Redis) {}

  async get(key: string) {
    const data = await this.client.get(key);

    return data ? JSON.parse(data) : null;
  }

  async set(key: string, data: unknown) {
    await this.client.set(key, JSON.stringify(data));
  }
}
