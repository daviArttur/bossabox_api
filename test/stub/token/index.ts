import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/infra/interfaces';

interface GetStubTokenConfig {
  expiresIn: string | number; // 60000 == 1h | 100 == 1s | 1000 = 10s
}

export function getStubToken(
  payload: TokenPayload,
  config: GetStubTokenConfig,
) {
  return new JwtService({ privateKey: process.env.JWT_KEY }).sign(payload, {
    expiresIn: config.expiresIn,
  });
}
