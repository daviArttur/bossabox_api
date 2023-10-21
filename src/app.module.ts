import { Module } from '@nestjs/common';
import { PrismaService } from './infra/services/prisma';
import { CreateToolController } from './infra/controllers/create-tool';
import { CreateToolUseCase } from './app/usecases/create-tool';
import { ToolRepository } from './app/contracts/repository';
import { ToolRepositoryPrisma } from './infra/repositories/tool';
import { FindToolByTagUseCase } from './app/usecases/find-tool-by-tag';
import { FindByTagController } from './infra/controllers/find-tool-by-tag';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './infra/security/authentication/strategy/jwt';
import { CacheModule } from './infra/modules/cache';
import { ToolRepositoryProxy } from './app/proxy/repository/tool';
import { ConfigModule } from '@nestjs/config';
import { FindToolsController } from './infra/controllers/find-tools';
import { FindToolsUsecase } from './app/usecases/find-tools';

@Module({
  imports: [
    CacheModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [CreateToolController, FindByTagController, FindToolsController],
  providers: [
    ToolRepositoryProxy,
    CreateToolUseCase,
    FindToolsUsecase,
    FindToolByTagUseCase,
    { provide: ToolRepository, useClass: ToolRepositoryPrisma },
    PrismaService,
    JwtStrategy,
  ],
})
export class AppModule {}
