import { PrismaClient } from '@prisma/client';
import { baseEnc, baseDec } from './encrypt';
import crypto from 'crypto';


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  switch (body.type) {
    case 'test':
      
      return 'asd';
    case 'login':
      return ret();
    default:
      break;
  }
});

function ret() {
return process.env.DATABASE_URL;
}


