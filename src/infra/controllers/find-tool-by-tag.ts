import { FindToolByTagUseCase } from 'src/app/usecases/find-tool-by-tag';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ToolModel } from '../models/swagger/tool';
@ApiTags('USER | Find tools by tag')
@Controller('/tags')
export class FindByTagController {
  constructor(private usecase: FindToolByTagUseCase) {}

  @ApiResponse({ type: ToolModel })
  @Get()
  async handle(@Query('t') tag: string): Promise<{ data: ToolModel[] }> {
    return { data: await this.usecase.perform(tag) };
  }
}
