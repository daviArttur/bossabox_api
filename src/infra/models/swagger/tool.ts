import { ApiProperty } from '@nestjs/swagger';
import { Tool } from 'src/domain/entity/tool';

export class ToolModel implements Tool {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  link: string;

  @ApiProperty({ isArray: true })
  tags: string[];

  @ApiProperty()
  title: string;
}
