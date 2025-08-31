import { checkToken } from "~/composables/defaults";
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const authHeader = event.node.req.headers['authorization'] || '';
  const isAuthorized = (runtimeConfig.secret_header === authHeader) || await checkToken(event) === true;
  console.log('AUTH: ', isAuthorized);
  
  if (!isAuthorized) {
    console.error('401, Unauthorized');
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
  }
  const uuid = getQuery(event).userID

  const user = await $fetch('/api/users/stabtag',{
    method: 'POST',
    headers: {
      'authorization' : authHeader
    },
    body: {
      uuid: uuid
    }
  })
  const name = user?.name

const programok = await p.programok.findMany();

const filteredPrograms = programok.filter(p => 
  Array.isArray(p.beosztva) && p.beosztva.includes(name)
);

return filteredPrograms

});



interface Program {
  id: number
  title: string
  startTime: string
  duration: string
  location?: string
  description?: string
  beosztva?: string[] // JSON array of assigned days
  day: string
}
