import bcrypt from 'bcryptjs';
import { read } from 'fs';
import { SignJWT, jwtVerify } from 'jose';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Forward the encrypted data to the encryption endpoint
    const { decryptedMessage } = await $fetch('/api/encryption', {
      method: 'POST',
      body: {
        encryptedMessage: body.encryptedData, // Forward the encrypted data
      },
    });

    // Parse the decrypted data into an object
    const { username, password } = decryptedMessage;

    // Validate the credentials
    const user = await validateCredentials(username, password);

    if (user) {
      // Generate a JWT token
      const runtimeConfig = useRuntimeConfig();
      const secretKey = new TextEncoder().encode(runtimeConfig.public.jwtSecret);

      const token = await new SignJWT({ userId: user.id, username: user.username })
        .setProtectedHeader({ alg: 'HS256' }) // Algorithm
        .setIssuedAt() // Current time
        .setExpirationTime('1h') // Token expires in 1 hour
        .sign(secretKey); // Sign with the secret key

      console.log('JWT Token:', token);

      // Verify the token (optional, for debugging)
      const { payload } = await jwtVerify(token, secretKey);
      console.log('Decoded JWT Token:', payload);

      return { token };
    } else {
      throw createError({ statusCode: 401, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw createError({ statusCode: 500, message: 'Internal Server Error' });
  }
});
async function validateCredentials(username: string, password: string) {
  const db = hubDatabase();
  console.log('Database connection:', db); // Log the database connection

  try {
    //// Fetch the user from the database
    const user = await db.prepare(`
      SELECT * FROM users WHERE username = ?;
    `)
      .bind(username)
      .first();
    if (!user) {
      return null; // User not found
    }
    const isValid = await $fetch('/api/encrypt-password', {
      method: 'POST',
      headers: {
        key: useRuntimeConfig().secret_header
      },
      body: {type: 'verify', password: password, hashedPassword: user.password}
    })
    console.log(isValid)
    if (isValid) {
      return user; // Password matches
    } else {
      return null; // Password does not match
    }
  } catch (error) {
    console.error('Error validating credentials:', error);
    throw createError({ statusCode: 500, message: 'Internal server error' });
  }
}
