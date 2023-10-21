import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindToolsUsecase } from 'src/app/usecases/find-tools';
import { ToolModel } from '../models/swagger/tool';

@ApiTags('USER | Find tools')
@Controller()
export class FindToolsController {
  constructor(private usecase: FindToolsUsecase) {}

  @Get()
  async handle(): Promise<{ data: ToolModel[] }> {
    return { data: await this.usecase.perform() };
  }
}
