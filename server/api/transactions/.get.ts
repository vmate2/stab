import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  console.log('Fetching balance');
  
  const token = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];
  if (!token) {
    console.error('No token provided in transactions/.get.ts');
    throw createError({
        statusCode: 401,
        statusMessage: 'no token provided',
        message: 'No token provided in transactions/.get.ts',
    });
  }
  // Check if the request is authorized
  const isvalidJWT = await $fetch('/api/verifyJWT', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`
    }
  });
  console.warn('isvalidJWT: ', isvalidJWT);
  
  if (!isvalidJWT) {
    console.error('Unauthorized in transactions/.get.ts');
    throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Unauthorized in transactions/.get.ts',
    });
  }
  console.log('READING TYPE HEADER');
  
  const type = event.node.req.headers['type'] || event.node.req.headers['x-type'] || '';

  
   if (type == 'getBalance') {
    try {
      console.log('Getting balance');
      
      const result = await prisma.stabcash.findUnique({
        where: { id: 1 },
        select: { 
          balance: true,
          income: true,
          expense: true
         }
      });
      console.log('Result: ', result);
      
      return {
        message: 'Balance retrieved successfully',
        balance: Number(result?.balance),
        income: Number(result?.income),
        expense: Number(result?.expense)
      };
    } catch (error:any) {
      throw createError({
          statusCode: 500,
          statusMessage: 'Error in retrieving balance',
          message: error.message,
      })
    }
   }
})
