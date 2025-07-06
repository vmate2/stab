import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

export default defineEventHandler(async (event) => {
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
      console.log(body);
      try {
          const result = await p.polorendeles.create({
          data: {
            name: body.name,
            phone: body.phone || null,
            felirat: body.felirat || null,
            size: body.size,
            paid: body.paid || false,
            note: body.note || null
          }
        });
        console.log(result);
        return result;

      } catch (error: any) {
        console.error('Error adding to db:', error);
        throw createError({
          statusCode: 500,
          statusMessage: 'adding to db failed',
          message: error.message
        });
        
      }

      

    }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: e
    });
  }

})
