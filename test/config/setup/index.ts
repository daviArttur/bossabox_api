import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { AppModule } from 'src/app.module';
import { ExceptionsFilter } from 'src/infra/error/exceptions-filter';

export async function getE2ETestSetup() {
  const container = await new PostgreSqlContainer().start();
  const urlConnection = `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}?schema=public`;
  process.env.DATABASE_URL = urlConnection;

  // Push db schema
  execSync('npx prisma db push', {
    env: {
      ...process.env,
      DATABASE_URL: urlConnection,
    },
  });

  // App config
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('/api/tools');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ExceptionsFilter());

  // Prisma client
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: urlConnection,
      },
    },
  });

  // Run app
  await app.init();

  return {
    app,
    prisma,
    container,
  };
}
