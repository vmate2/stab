import { jwtVerify } from 'jose';
import { createError } from 'h3'; // Import createError from h3
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// server/api/users/.get.ts
export default defineEventHandler(async (event) => {
  // Log message
  console.log('Fetching user data...');
  const body = await readBody(event);
  console.log(body);
  

  // Get the token from the request headers (it can be in 'Authorization' or 'token')
  const token:any = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];
  console.log("TOKEN: ", token);
  console.log("headers: ", event.node.req.headers['authorization']);
  
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Token is missing',
    });
  }

  try {
    

    const payload = await $fetch('/api/verifyJWT', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.warn('PAYLOAD COMING');
    
    console.warn('Payload:', payload);
    

    if (!payload) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid token',
      });
    }

    const dat = await prisma.users.findUnique({
      where: {
        uuid: body.uuid,
      },
    });

    

    const user =  await prisma.users.findUnique({
      where: {
        uuid: body.uuid,
      },
    });

    const stabtag = await prisma.stabtagok.findUnique({
      where: {
        uuid: body.uuid,
      },
    });

    const mergedObject = { ...user, ...stabtag };

    console.log(mergedObject);

    return mergedObject;




    
  } catch (error:any) {
    console.error('Token verification error:', error);

    // Check the specific error type (expired or invalid token)
    if (error.code === 'ERR_JWT_EXPIRED') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Token expired',
      });
    } else if (error.code === 'ERR_JWS_INVALID') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid token signature',
      });
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Token verification failed',
      });
    }
  }
});
