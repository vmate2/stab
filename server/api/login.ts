import { SignJWT, jwtVerify  } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient;

export default defineEventHandler(async (event) => {
  try {
    console.log('HERE')
    const body = await readBody(event);
    console.log(body)
    const username = atob(body.username);
    const password = atob(body.password);

    console.log(username, password);

    const user = await validateCredentials(username, password);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Hibás felhasználónév!' });
    }

    const runtimeConfig = useRuntimeConfig();
    const secretKey = new TextEncoder().encode(runtimeConfig.public.jwtSecret);
    console.log('SECRET: ', secretKey)

    const token = await new SignJWT({ userId: user.uuid, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secretKey);


    const { payload } = await jwtVerify(token, secretKey);
    console.log('token verified');
    
    console.log(user);
    

    return { token};
  } catch (error: any) {
    console.error('Error during login:', error);
    if (error.statusCode === 401) {
      throw error;  // Rethrow 401 error for invalid credentials
    } else {
      throw createError({ statusCode: 500, statusMessage: 'Intrernal Server Error' });
    }
  }
});

async function validateCredentials(username: string, password: string) {
  try {
    const user = await prisma.users.findFirst({
      where: { username },
      select: { id: true, uuid: true, username: true },
    });

    if (!user) return null;

    console.log('User data:', user);

    // Verify password correctness
    const isValid = await $fetch('/api/encrypt-password', {
      method: 'POST',
      headers: { key: useRuntimeConfig().secret_header },
      body: { type: 'verify', password, id: user.uuid },
    });

    if (isValid === false) {
      // If password is invalid, throw 401 Unauthorized
      throw createError({
        statusCode: 401,
        statusMessage: 'Hibás jelszó!', // Incorrect password
      });
    }

    console.log(isValid);
    return user;  // If password is valid, return the user

  } catch (error) {
    console.error('Error validating credentials:', error);
    // Catch unexpected errors (e.g., DB issues, encryption problems)
    throw createError({ statusCode: 401, statusMessage: 'Helytelen jelszo!' });
  }
}