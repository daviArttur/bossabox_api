import { PrismaService } from './prisma';

test.skip('PrismaService', async () => {
  // Arrange
  const prismaService = new PrismaService({
    datasources: { db: { url: 'postgresql://' } },
  });
  const $connectSpy = jest.spyOn(prismaService, '$connect');

  try {
    // Act
    await prismaService.onModuleInit();
  } catch (err) {
    // Assert
    expect($connectSpy).toHaveBeenCalled();
  }
});
