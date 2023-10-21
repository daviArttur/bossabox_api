import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export class Swagger {
  constructor(
    private builder: DocumentBuilder,
    private module: typeof SwaggerModule,
  ) {}

  config(app: INestApplication) {
    const config = this.builder.addBearerAuth().build();
    const document = this.module.createDocument(app, config);
    this.module.setup('/api/swagger', app, document);
  }
}
