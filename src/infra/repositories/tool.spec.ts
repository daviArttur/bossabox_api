import { Tool } from 'src/domain/entity/tool';
import { makeToolStubDto } from 'test/stub';
import { PrismaServiceStub } from 'test/stub/db/prisma';
import { ToolDb, ToolRepositoryPrisma, selectToolByTagQuery } from './tool';
import { QueryException } from 'src/app/error/query';
import { faker } from '@faker-js/faker';

describe('test ToolRepositoryPrisma', () => {
  let spy = {
    'tools.create': {} as jest.SpyInstance,
    'tools.findMany': {} as jest.SpyInstance,
    $queryRaw: {} as jest.SpyInstance,
  };

  let repository: ToolRepositoryPrisma;

  beforeEach(() => {
    //
    const prismaService = new PrismaServiceStub().get();

    spy = {
      'tools.create': jest.spyOn(prismaService.tools, 'create'),
      'tools.findMany': jest.spyOn(prismaService.tools, 'findMany'),
      $queryRaw: jest.spyOn(prismaService, '$queryRaw'),
    };

    repository = new ToolRepositoryPrisma(prismaService);
  });

  // Arrange
  const toolStubDto = new Tool(makeToolStubDto());

  describe('test method => save()', () => {
    it('should save a tool', async () => {
      // Arrange
      const expectedId = faker.number.int();
      spy['tools.create'].mockResolvedValue({ id: expectedId });
      // Act
      const result = await repository.save(toolStubDto);

      // Assert
      expect(result).toEqual(
        new Tool({
          id: expectedId,
          description: toolStubDto.description,
          link: toolStubDto.link,
          title: toolStubDto.title,
          tags: toolStubDto.tags,
        }),
      );
      expect(spy['tools.create']).toHaveBeenCalledWith({
        data: {
          description: toolStubDto.description,
          link: toolStubDto.link,
          title: toolStubDto.title,
          tags: {
            createMany: { data: toolStubDto.tags.map((tag) => ({ tag })) },
          },
        },
        select: {
          id: true,
        },
      });
    });

    it('should throw QueryException because an erro ocurred on prisma', async () => {
      // Arrange
      spy['tools.create'].mockImplementation(() => {
        throw new Error(); // throw error on prisma
      });
      const toolStub = new Tool(makeToolStubDto());

      // Assert
      expect(repository.save(toolStub)).rejects.toThrow(QueryException);
    });
  });

  describe('test method => findByTag()', () => {
    it('should save a tool', async () => {
      // Arrange
      const tag = 'tag';

      spy.$queryRaw.mockResolvedValue([
        {
          id: toolStubDto.id,
          description: toolStubDto.description,
          link: toolStubDto.link,
          title: toolStubDto.title,
          tags: [{ tag }],
        },
      ] satisfies ToolDb[]);

      // Act
      const tools = await repository.findByTag(tag);

      // Assert
      expect(tools).toEqual([
        new Tool({
          id: toolStubDto.id,
          description: toolStubDto.description,
          link: toolStubDto.link,
          title: toolStubDto.title,
          tags: [tag],
        }),
      ]);
      expect(spy.$queryRaw).toHaveBeenCalledWith(selectToolByTagQuery(tag));
    });

    it('should throw QueryException because an erro ocurred in prisma client', async () => {
      // Arrange
      spy.$queryRaw.mockImplementation(() => {
        throw new Error(); // throw error on prisma
      });

      // Assert
      expect(repository.findByTag('')).rejects.toThrow(QueryException);
    });
  });

  describe('test method => findAll()', () => {
    it('should save a tool', async () => {
      // Arrange
      const tag = 'tag';

      spy['tools.findMany'].mockResolvedValue([
        {
          id: toolStubDto.id,
          description: toolStubDto.description,
          link: toolStubDto.link,
          title: toolStubDto.title,
          tags: [{ tag }],
        },
      ] satisfies ToolDb[]);

      // Act
      const tools = await repository.findAll();

      // Assert
      expect(tools).toEqual([
        new Tool({
          id: toolStubDto.id,
          description: toolStubDto.description,
          link: toolStubDto.link,
          title: toolStubDto.title,
          tags: [tag],
        }),
      ]);
      expect(spy['tools.findMany']).toHaveBeenCalledWith({
        select: {
          description: true,
          id: true,
          link: true,
          tags: {
            select: {
              tag: true,
              id: true,
            },
          },
          title: true,
        },
      });
    });

    it('should throw QueryException because an erro ocurred in prisma client', async () => {
      // Arrange
      spy['tools.findMany'].mockImplementation(() => {
        throw new Error(); // throw error on prisma
      });

      // Assert
      expect(repository.findAll()).rejects.toThrow(QueryException);
    });
  });
});
