import { makeToolStubDto } from 'test/stub';
import { CreateToolUseCase } from './create-tool';
import { Tool } from 'src/domain/entity/tool';
import { ToolRepositoryProxy } from '../proxy/repository/tool';

describe('test CreateToolUseCase', () => {
  let usecase: CreateToolUseCase;

  let spy = {
    'toolRepository.save': {} as jest.SpyInstance,
  };

  beforeEach(() => {
    const repositoryProxyStub = {
      save: jest.fn(),
    } as any as ToolRepositoryProxy;

    spy = {
      'toolRepository.save': jest.spyOn(repositoryProxyStub, 'save'),
    };

    usecase = new CreateToolUseCase(repositoryProxyStub);
  });

  // Stub
  const dtoStub = makeToolStubDto();

  it('should create a tool', async () => {
    // Act
    await usecase.perform(dtoStub);

    // Assert
    expect(spy['toolRepository.save']).toHaveBeenCalledWith(
      Tool.create(dtoStub),
    );
  });
});
