import { checkToken } from "~/composables/defaults";
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const authHeader = event.node.req.headers['authorization'] || '';
  
  const isAuthorized = (runtimeConfig.secret_header === authHeader) || await checkToken(event) === true;

  if (!isAuthorized) {
    console.error('401, Unauthorized');
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
  }
  try {
    const body = await readBody(event);
    const result = await p.programok.delete({
      where: {
        id: body.id
      }
    })

    if(result) {
      return {success: true}
    }

  } catch (error) {
    console.error(error);
    throw createError({
        statusCode: 500,
        statusMessage: 'Upload to DB failed'
    })
  }
});
