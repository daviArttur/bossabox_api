import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Swagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });

  app.setGlobalPrefix('/api/tools');

  new Swagger(new DocumentBuilder(), SwaggerModule).config(app);

  await app.listen(3000, () => console.log('API RUNNING ON PORT: ' + 3000));
}
bootstrap();
