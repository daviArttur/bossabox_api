import { Inject, Injectable } from '@nestjs/common';
import { ToolRepository } from '../contracts/repository';
import { Tag } from 'src/domain/types';
import { ToolCacheService } from '../services/cache/tool';

type GeneralToolCache = Pick<
  ToolCacheService,
  'findToolByTag' | 'setToolsInTagCache'
>;

@Injectable()
export class FindToolByTagUseCase {
  constructor(
    @Inject(ToolRepository) private toolRepository: ToolRepository,
    @Inject(ToolCacheService) private toolCacheService: GeneralToolCache,
  ) {}

  async perform(tag: Tag) {
    const tagsInCache = await this.toolCacheService.findToolByTag(tag);

    if (tagsInCache) return tagsInCache;

    const tools = await this.toolRepository.findByTag(tag);

    await this.toolCacheService.setToolsInTagCache(tag, tools);

    return tools;
  }
}
