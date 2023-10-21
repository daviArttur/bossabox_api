import { RoleEnum } from 'src/infra/interfaces';
import { JwtStrategy } from './jwt';

describe('test JwtStrategy', () => {
  it('should validade and return', async () => {
    process.env.JWT_KEY = 'secret';

    // Arrange
    const strategy = new JwtStrategy();

    // Act
    const data = await strategy.validate({ role: RoleEnum.USER, sub: 1 });

    // Assert
    expect(data).toEqual({ role: RoleEnum.USER, sub: 1 });
  });
});
