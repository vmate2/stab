import { jwtVerify } from 'jose';
import { createError } from 'h3'; // Import createError from h3
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// server/api/users/.get.ts
export default defineEventHandler(async (event) => {
  // Log message
  console.log('Fetching user data...');

  // Get the token from the request headers (it can be in 'Authorization' or 'token')
  const token:any = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Token is missing',
    });
  }

  try {
    const runtimeConfig = useRuntimeConfig();

    // Ensure the secret key is encoded as Uint8Array
    const secretKey = new TextEncoder().encode(runtimeConfig.public.jwtSecret);

    // Verify the JWT token's authenticity
    const { payload } = await jwtVerify(token, secretKey);

    // Log the decoded payload (you can use it as needed)
    console.log('Decoded Payload:', payload);

    // Your logic here, for example, returning user info
    const dataUser = await prisma.stabtagok.findMany();
    //TODO const dataPolo = await prisma.polorendeles.findMany();
    
    // Combine the arrays using concat or spread operator
    //TODO const data = [...dataUser, ...dataPolo]; // Using spread operator to merge arrays
    const data = dataUser; //? Placeholder functionality
    console.log(data);
    
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