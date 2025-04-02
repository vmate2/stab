import { jwtVerify  } from 'jose';

export const useDecodeJWT = async (accessToken:string) => {
  try {
    const secretKey = new TextEncoder().encode(useRuntimeConfig().public.jwtSecret);
    const { payload } = await jwtVerify(accessToken, secretKey);
    
    return payload;
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Invalid token' });
  }

}
  
