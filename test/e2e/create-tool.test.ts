import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { getE2ETestSetup } from 'test/config/setup';
import request from 'supertest';
import { getStubToken } from 'test/stub/token';
import { RoleEnum } from 'src/infra/interfaces';

describe('test POST /tools', () => {
  let container: StartedPostgreSqlContainer;
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const setup = await getE2ETestSetup();

    app = setup.app;
    container = setup.container;
    prisma = setup.prisma;
  }, 60000);

  afterAll(async () => {
    await container.stop();
  });

  it('should create a tool', async () => {
    // Arrange
    const requestBody = {
      description: 'string',
      link: 'https://google.com',
      tags: ['test', 'et'],
      title: 'string',
    };

    const token = getStubToken(
      {
        role: RoleEnum.ADMIN,
        sub: 1,
      },
      { expiresIn: '1h' },
    );

    // Act
    const response = await request(await app.getHttpServer())
      .post('/api/tools')
      .set('Authorization', 'Bearer ' + token)
      .send(requestBody);

    const toolInDb = await prisma.tools.findFirst({
      include: {
        tags: true,
      },
    });

    // Assert
    expect(toolInDb.tags[0].tag).toBe(requestBody.tags[0]);
    expect(toolInDb.tags[1].tag).toBe(requestBody.tags[1]);
    expect(response.statusCode).toBe(201);
    expect(toolInDb.id).toBe(1);
    expect(toolInDb.description).toBe(requestBody.description);
    expect(toolInDb.link).toBe(requestBody.link);
    expect(toolInDb.title).toBe(requestBody.title);
  }, 60000);
});
