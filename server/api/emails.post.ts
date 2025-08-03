import { checkToken } from "~/composables/defaults";
import { getInboxEmails } from "../imapclient";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const authHeader = event.node.req.headers['authorization'] || '';
  const secretHeader = event.node.req.headers['token'];

  const bearerToken = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
  console.log(authHeader);
  console.log(runtimeConfig.secret_header);
  
  
  const isAuthorized = (runtimeConfig.secret_header === authHeader) || await checkToken(event) === true;

  if (!isAuthorized) {
    console.error('401, Unauthorized');
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
  }

  const body = await readBody(event);
  console.log(body);
  
  

  const emails = await getInboxEmails(body.email);

  return emails;
});
