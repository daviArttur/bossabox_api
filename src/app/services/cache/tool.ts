import { Inject, Injectable } from '@nestjs/common';
import { Tool } from 'src/domain/entity/tool';
import { Tag } from 'src/domain/types';

export interface CacheAdapter {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => void;
}

export const CacheAdapter = Symbol('CacheAdapter');

@Injectable()
export class ToolCacheService {
  constructor(@Inject(CacheAdapter) private cache: CacheAdapter) {}

  async findTools() {
    return await this.cache.get('tools');
  }

  async setToolsInCache(tool: Tool[]): Promise<void> {
    this.cache.set('tools', tool);
  }

  async findToolByTag(tag: Tag): Promise<Tool[] | null> {
    return await this.cache.get(`tool_tag_${tag}`);
  }

  async setToolsInTagCache(tag: Tag, tools: Tool[]) {
    this.cache.set(`tool_tag_${tag}`, tools);
  }
}
