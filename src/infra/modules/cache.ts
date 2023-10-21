import { Module } from '@nestjs/common';
import { CacheAdapter, ToolCacheService } from 'src/app/services/cache/tool';
import { RedisAdapter } from '../adapter/redis';
import { Redis } from 'ioredis';

const CacheAdapterMock = {
  set: () => {},
  get: () => null,
};

@Module({
  providers: [
    ToolCacheService,
    {
      provide: CacheAdapter,
      useValue:
        process.env.NODE_ENV != 'test'
          ? new RedisAdapter(new Redis({ host: 'redis' }))
          : CacheAdapterMock,
    },
  ],
  exports: [ToolCacheService],
})
export class CacheModule {}
