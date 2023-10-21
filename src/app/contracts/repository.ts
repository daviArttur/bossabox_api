import { Tool } from 'src/domain/entity/tool';

export interface ToolRepository {
  save: (tool: Tool) => Promise<any>;
  findByTag: (document: string) => Promise<Tool[]>;
  findAll: () => Promise<Tool[]>;
}

export const ToolRepository = Symbol('ToolRepository');
