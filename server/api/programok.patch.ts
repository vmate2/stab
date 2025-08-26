import { checkToken } from "~/composables/defaults";
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  console.log('here');
  
  const authHeader = event.node.req.headers['authorization'] || '';
  
  const isAuthorized = (runtimeConfig.secret_header === authHeader) || await checkToken(event) === true;

  if (!isAuthorized) {
    console.error('401, Unauthorized');
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
  }
  try {
    const body = await readBody(event);
    const data = await p.programok.update({
      where: {id: body.id},
      data: {
        title: body.title,
        description: body.description,
        startTime: body.startTime,
        duration: body.duration,
        location: body.duration,
        beosztva: body.beosztva,
        day: body.day
      }
    })

    if(data) {
      console.warn(data);
      
      return {success: true}
    }
    else {
      console.warn('what');
      
    }

  } catch (error) {
    console.error(error);
    throw createError({
        statusCode: 500,
        statusMessage: 'Upload to DB failed'
    })
  }
});
