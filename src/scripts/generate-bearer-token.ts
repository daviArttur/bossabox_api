import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { RoleEnum, TokenPayload } from '../infra/interfaces';

dotenv.config();

function main() {
  const payload: TokenPayload = { role: RoleEnum.ADMIN, sub: 1 };

  console.log(
    'Bearer token: ',
    new JwtService().sign(payload, {
      secret: process.env.JWT_KEY,
      expiresIn: '1h',
    }),
  );
}
main();
