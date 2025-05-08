import { jwtVerify, SignJWT } from 'jose';

export default defineEventHandler(async (event) => {

  const token = getHeader(event, 'Authorization')?.split(' ')[1]; // Get the token from the Authorization header
  console.log("TOKEN IN verifyJWT: ", token);
  
  if (!token) {
    throw createError({ statusCode: 401, message: 'No token provided', statusMessage: 'Unauthorized' });
  }
  if (typeof token !== 'string') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid token format',
    });
  }
  try {

    const runtimeConfig = useRuntimeConfig();
    const secretKey = new TextEncoder().encode(runtimeConfig.jwtSecret);

    const { payload } = await jwtVerify(token, secretKey);
    if (payload) console.log("Payload: ", payload);
    
    return { payload };
  }
  catch (error:any) {
    console.error("Error in verifyJWT: ", error);
    throw createError({ statusCode: 401, statusMessage: 'Invalid token', message: error });
  }


})
