import { Inject, Injectable } from '@nestjs/common';
import { ToolRepository } from '../contracts/repository';
import { ToolCacheService } from '../services/cache/tool';

type IToolCache = Pick<ToolCacheService, 'findTools' | 'setToolsInCache'>;

@Injectable()
export class FindToolsUsecase {
  constructor(
    @Inject(ToolRepository) private toolRepository: ToolRepository,
    @Inject(ToolCacheService) private toolCacheService: IToolCache,
  ) {}

  async perform() {
    const toolsInCache = await this.toolCacheService.findTools();

    if (toolsInCache) return toolsInCache;

    const tools = await this.toolRepository.findAll();

    await this.toolCacheService.setToolsInCache(tools);

    return tools;
  }
}
