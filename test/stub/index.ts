import { CreateToolDto } from 'src/domain/entity/tool';
import { faker } from '@faker-js/faker';
import { ToolRepository } from 'src/app/contracts/repository';

export const makeToolStubDto = () =>
  ({
    description: faker.string.sample(),
    id: faker.number.int(),
    link: faker.string.sample(),
    tags: [faker.string.nanoid(), faker.string.nanoid()],
    title: faker.string.sample(),
  }) satisfies CreateToolDto;

export class ToolRepositoryStub {
  get() {
    return {
      save: jest.fn(),
      findByTag: jest.fn(),
      findAll: jest.fn(),
    } as any as ToolRepository;
  }
}
