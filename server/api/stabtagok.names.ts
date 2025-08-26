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

  const data = await p.stabtagok.findMany({
    select: {
      name: true
    }
  });
  return data;
});


