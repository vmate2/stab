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
        const body = await readBody(event);
        const result = await p.locations.upsert({
          where: {
            userID: body.userID,
          },
          update: {
            username: body.username,
            latitude: body.lat,
            longitude: body.lon,
          },
          create: {
            userID: body.userID,
            username: body.username,
            latitude: body.lat,
            longitude: body.lon,
          }
        });
        
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
