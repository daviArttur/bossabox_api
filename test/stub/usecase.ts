export class UseCaseStub {
  get() {
    return {
      perform: jest.fn(),
    } as any;
  }
}
