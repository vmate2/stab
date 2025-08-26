import { checkToken } from "~/composables/defaults";
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const authHeader = event.node.req.headers['authorization'] || '';
  if (!authHeader) {
    return await queryClient();
  }
  
  const isAuthorized = (runtimeConfig.secret_header === authHeader) || await checkToken(event) === true;

  if (!isAuthorized) {
    console.error('401, Unauthorized');
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
  }
  return await queryAuth();
});



const queryClient = async () => {
  const data = await p.programok.findMany({
    select: {
      title: true,
      description: true,
      startTime: true,
      duration: true,
      location: true,
      day: true
    }
  })
  return data;
}

const queryAuth = async () => {
  const data = await p.programok.findMany({})
  return data;
}