import { Inject, Injectable } from '@nestjs/common';
import { ToolRepository } from 'src/app/contracts/repository';
import { ToolCacheService } from 'src/app/services/cache/tool';
import { Tool } from 'src/domain/entity/tool';

@Injectable()
export class ToolRepositoryProxy {
  constructor(
    @Inject(ToolRepository) private toolRepository: ToolRepository,
    @Inject(ToolCacheService) private toolCacheService: ToolCacheService,
  ) {}

  async save(tool: Tool) {
    tool = await this.toolRepository.save(tool);
    await this.toolCacheService.setToolsInCache([tool]);

    for (const tag of tool.tags) {
      await this.toolCacheService.setToolsInTagCache(tag, [tool]);
    }
  }
}
