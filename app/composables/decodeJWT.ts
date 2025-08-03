import { jwtVerify  } from 'jose';
/**
 * 
 * @param accessToken 
 * @returns payload
 * @throws 401 if token is invalid
 * @description This function decodes a JWT token using the secret key from the runtime configuration.
 */
export const useDecodeJWT = async (accessToken:string) => {
  try {
    const secretKey = new TextEncoder().encode(useRuntimeConfig().jwtSecret);
    const { payload } = await jwtVerify(accessToken, secretKey);
    
    return payload;
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Invalid token' });
  }

}
  
