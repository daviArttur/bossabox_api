import { makeToolStubDto } from 'test/stub';
import { Tool } from './tool';

const dto = makeToolStubDto();

test('Tool', () => {
  const tool = new Tool(dto);

  // Assert
  expect(tool.id).toBe(dto.id);
  expect(tool.description).toBe(dto.description);
  expect(tool.link).toBe(dto.link);
  expect(tool.tags).toEqual(dto.tags);
  expect(tool.title).toBe(dto.title);
});
