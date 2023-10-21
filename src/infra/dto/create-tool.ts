import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
import { CreateToolDto } from 'src/domain/entity/tool';

export class CreateToolDtoInfra implements Omit<CreateToolDto, 'id'> {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsString()
  title: string;
}
