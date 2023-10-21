import { Injectable } from '@nestjs/common';
import { CreateToolDto, Tool } from 'src/domain/entity/tool';
import { ToolRepositoryProxy } from '../proxy/repository/tool';

@Injectable()
export class CreateToolUseCase {
  constructor(private toolRepositoryProxy: ToolRepositoryProxy) {}

  async perform(dto: Omit<CreateToolDto, 'id'>) {
    const tool = Tool.create(dto);

    await this.toolRepositoryProxy.save(tool);
  }
}
