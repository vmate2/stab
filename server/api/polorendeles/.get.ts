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
      const result = await p.polorendeles.findMany({});
      if (result && result.length > 0) {
        return result;
      }
      else {
        return false;
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
