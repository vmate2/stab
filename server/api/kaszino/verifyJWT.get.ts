import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.split(' ')[1]; // Get the token from the Authorization header
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
  

      console.log('Token: ', token);
      
      const payload = jwt.verify(token, useRuntimeConfig().jwtSecret);
      if (payload) {console.log("Payload: ", payload)} else {console.error('No payload shit')}
      console.log('payload in verifyJWT: ', payload);
      
      return { payload };
    }
    catch (error:any) {
      console.error("Error in verifyJWT: ", error);
      throw createError({ statusCode: 401, statusMessage: 'Invalid token', message: error });
    }
})
