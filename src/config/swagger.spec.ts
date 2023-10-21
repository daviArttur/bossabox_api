import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { Swagger } from './swagger';

test.skip('Swagger', () => {
  // Arrange
  const configStub = 'configStub' as any;
  const documentStub = 'documentStub' as any;

  const builderStub = {
    build: jest.fn(),
  } as any as DocumentBuilder;

  const moduleStub = {
    createDocument: jest.fn(),
    setup: jest.fn(),
  } as any as typeof SwaggerModule;

  const nestApp = {
    setup: jest.fn(),
  } as any as INestApplication;

  const spy = {
    'builder.build': jest.spyOn(builderStub, 'build'),
    'module.createDocument': jest.spyOn(moduleStub, 'createDocument'),
    'module.setup': jest.spyOn(moduleStub, 'setup'),
  };

  spy['builder.build'].mockReturnValue(configStub);
  spy['module.createDocument'].mockReturnValue(documentStub);

  // Act
  const swagger = new Swagger(builderStub, moduleStub);
  swagger.config(nestApp);

  // Assert
  expect(spy['builder.build']).toHaveBeenCalled();
  expect(spy['module.createDocument']).toHaveBeenCalledWith(
    nestApp,
    configStub,
  );
  expect(spy['module.setup']).toHaveBeenCalledWith(
    '/api/swagger',
    nestApp,
    documentStub,
  );
});
