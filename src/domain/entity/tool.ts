import { Tag } from '../types';

export interface CreateToolDto {
  readonly id: number;
  title: string;
  link: string;
  description: string;
  tags: Tag[];
}

export class Tool {
  id: number;
  title: string;
  link: string;
  description: string;
  tags: Tag[];

  constructor(dto: CreateToolDto) {
    this.id = dto.id;
    this.title = dto.title;
    this.link = dto.link;
    this.description = dto.description;
    this.tags = dto.tags;
  }

  static create(dto: Omit<CreateToolDto, 'id'>) {
    return new Tool({ ...dto, id: -1 });
  }
}
