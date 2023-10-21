import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { getE2ETestSetup } from 'test/config/setup';
import request from 'supertest';
import { makeToolStubDto } from 'test/stub';

describe('test GET /tools', () => {
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

  it('should find a tool by tag', async () => {
    // Stub
    const dto = {
      1: makeToolStubDto(),
      2: makeToolStubDto(),
    };

    // Arrange
    await prisma.tools.create({
      data: {
        description: dto[1].description,
        link: dto[1].link,
        title: dto[1].title,
        id: 1,
        tags: {
          create: [{ tag: dto[1].tags[0] }, { tag: 'otherTag' }],
        },
      },
    });

    await prisma.tools.create({
      data: {
        description: dto[2].description,
        link: dto[2].link,
        title: dto[2].title,
        id: 2,
        tags: {
          create: [{ tag: dto[2].tags[0] }, { tag: 'otherTag' }],
        },
      },
    });

    // Act
    const response = await request(await app.getHttpServer()).get(`/api/tools`);

    // Assert
    expect(response.body).toEqual({
      data: [
        {
          id: 1,
          title: dto[1].title,
          link: dto[1].link,
          description: dto[1].description,
          tags: [dto[1].tags[0], 'otherTag'],
        },
        {
          id: 2,
          title: dto[2].title,
          link: dto[2].link,
          description: dto[2].description,
          tags: [dto[2].tags[0], 'otherTag'],
        },
      ],
    });
  }, 60000);
});
