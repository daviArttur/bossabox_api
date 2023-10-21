export class PrismaServiceStub {
  get() {
    return {
      $queryRaw: jest.fn(),
      tools: { create: jest.fn(), findMany: jest.fn() },
    } as any;
  }
}
