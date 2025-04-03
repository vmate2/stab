import { decodeJwt } from "jose";
import { useDecodeJWT } from "~/composables/decodeJWT";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  
  const body = await readBody(event);
  
  const token:any = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Token is missing',
    });
  }
  const payload = await useDecodeJWT(token)
  
  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Token is invalid',
    });
  }

  const pass = await $fetch('/api/encrypt-password', {
    method: 'POST',
    headers: { key: useRuntimeConfig().secret_header },
    body: {password: body.password },
  });
  
  if (await checkIfUserExists(body.uuid)) {
    try {
      
      const response = await prisma.users.update({
        where: {
          uuid: body.uuid,
        },
        data: {
          username: body.username,
          password: pass && typeof pass === 'object' && 'hashedpass' in pass ? pass.hashedpass : '',
        },
      });

      return response;

    } catch (error) {
      throw createError({
        statusCode: 501,
        statusMessage: 'Internal2 Server Error',
      });
      
    }
  }
});


const checkIfUserExists = async (uuid: string) => {
  try {
    
    const user = await prisma.users.findUnique({
      where: {
        uuid: uuid,
      },
    });

    return user !== undefined; // true if user exists, false otherwise

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
    
  }
}