/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ToolRepository } from 'src/app/contracts/repository';
import { PrismaService } from '../services/prisma';
import { Tool } from 'src/domain/entity/tool';
import { QueryException } from 'src/app/error/query';
import { Tag } from 'src/domain/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class ToolRepositoryPrisma implements ToolRepository {
  constructor(private prisma: PrismaService) {}

  async save(tool: Tool) {
    try {
      const tags: { tag: string }[] = [];

      for (const tag of tool.tags) {
        tags.push({ tag });
      }

      const { id } = await this.prisma.tools.create({
        data: {
          description: tool.description,
          link: tool.link,
          title: tool.title,
          tags: {
            createMany: { data: tags },
          },
        },
        select: { id: true },
      });

      tool['id'] = id;

      return tool;
    } catch (err) {
      throw new QueryException();
    }
  }

  async findByTag(tag: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

      const toolsDb: ToolDb[] = await this.prisma.$queryRaw(
        selectToolByTagQuery(tag),
      );

      const tools: Tool[] = [];

      for (const toolDb of toolsDb) {
        tools.push(
          new Tool({
            description: toolDb.description,
            id: toolDb.id,
            link: toolDb.link,
            tags: toolDb.tags.map((t) => t.tag),
            title: toolDb.title,
          }),
        );
      }
      return tools;
    } catch (err) {
      throw new QueryException();
    }
  }

  async findAll() {
    try {
      const toolsDb: ToolDb[] = await this.prisma.tools.findMany({
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

      const tools: Tool[] = [];

      for (const toolDb of toolsDb) {
        tools.push(
          new Tool({
            description: toolDb.description,
            id: toolDb.id,
            link: toolDb.link,
            tags: toolDb.tags.map((t) => t.tag),
            title: toolDb.title,
          }),
        );
      }

      return tools;
    } catch (err) {
      throw new QueryException();
    }
  }
}

export type ToolDb = {
  id: number;
  title: string;
  link: string;
  description: string;
  tags: { tag: string }[];
};

export const selectToolByTagQuery = (
  tag: Tag,
) => Prisma.sql`WITH toolsIdWithTag AS (
  SELECT "toolId" FROM tags WHERE tag = ${tag}
  )
SELECT TL.id, TL.title, TL.link, TL.description, json_agg(json_build_object('tag', TA.tag, 'id', TA.id)) as tags FROM tools AS TL
  INNER JOIN tags AS TA ON TL.id = TA."toolId"
  WHERE TL.id IN (
    SELECT "toolId" FROM toolsIdWithTag
  )
  GROUP BY TL.id
`;
