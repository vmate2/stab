import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

export default defineEventHandler(async (event) => {
  console.error('setlocation post handler called');
  
  
  const token:any = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Token is missing',
    });
  }

  try {
    const response = await $fetch('/api/verifyJWT', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (response) {

      const result = p.locations.findMany()
      console.warn('Results: ', result);
      
      return result;

    } else {
      return false;
    }



  } catch (e: any) {
  console.error('Error in sponsors post handler:', e);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: e
    });
  }

})
