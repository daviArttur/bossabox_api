import { CreateToolUseCase } from 'src/app/usecases/create-tool';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateToolDtoInfra } from '../dto/create-tool';
import { JwtAuthGuard } from '../security/authentication/guard/jwt';
import { RoleInterceptor } from '../security/authorization/interceptor/role';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('ADMIN | Create tool')
@UseInterceptors(RoleInterceptor)
@UseGuards(JwtAuthGuard)
@Controller()
export class CreateToolController {
  constructor(private usecase: CreateToolUseCase) {}

  @Post()
  async handle(@Body() dto: CreateToolDtoInfra) {
    await this.usecase.perform(dto);
  }
}
