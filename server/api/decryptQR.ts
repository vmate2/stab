import { createDecipheriv, createHash } from 'crypto'
import { PrismaClient } from '@prisma/client';
import { checkToken } from '~/composables/defaults';

const p = new PrismaClient();

export default defineEventHandler(async (event) => {
  if(await checkToken(event) === true) {
          const body = await readBody(event);
    console.log('Received body:', body);
    const decryptedBody = decrypt(body) as { winID: string };
    if (!decryptedBody || typeof decryptedBody !== 'object' || !decryptedBody.winID) {
      console.error('Decryption failed or invalid body:', body);
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: Invalid or missing winID in request body',
      });
    }
    
    const result = await p.wheelWin.findFirst({
      where: {
        winID: decryptedBody.winID
      },
      select: {
        isClaimed: true
      }
    });
    if (!result) {
      console.error('Nincs ilyen nyeremény az azonosítóval:', decryptedBody.winID);
      throw createError({
        statusCode: 404,
        statusMessage: 'Not found',
        message: 'Nincs ilyen nyeremeny az azonositóval!'
      });
    } else {
      if (result.isClaimed) {
        console.warn('A nyeremény már be lett gyűjtve!:', decryptedBody.winID);
        throw createError({
          statusCode: 400,
          statusMessage: 'Win already claimed',
          message: 'A nyeremény már be lett gyűjtve!'
        });
      } else {
      console.log('Decrypting data for winID:', decryptedBody.winID);
        //store change
        await p.wheelWin.update({
          where: {
            winID: decryptedBody.winID
          },
          data: {
            isClaimed: true
          }
        });
      return decryptedBody;
      }
    }
  }
    

})


function decrypt(payload: string): object | null {
  const { iv, data } = JSON.parse(payload)

  const key = createHash('sha256')
    .update(useRuntimeConfig().qrSecret)
    .digest()

  const decipher = createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'))
  let decrypted = decipher.update(data, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}
