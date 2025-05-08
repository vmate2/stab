import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';


const runtimeConfig = useRuntimeConfig();
const secretKey = runtimeConfig.secretKey;
const jwtSecret = runtimeConfig.jwtSecret;

export default defineEventHandler(async (event) => {
  // Verify the JWT
  const authHeader = getHeader(event, 'Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, jwtSecret); // Verify the token
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Invalid token' });
  }

  // Process the encrypted message
  const body = await readBody(event);
  const decryptedMessage = decryptMessage(body.encryptedMessage);
  console.log('Decrypted Message:', decryptedMessage);

  // Encrypt the response
  const responseMessage = 'Hello from the server!';
  const encryptedResponse = encryptMessage(responseMessage);

  return { encryptedResponse };
});

function encryptMessage(message: string) {
  return CryptoJS.AES.encrypt(message, secretKey).toString();
}

function decryptMessage(encryptedMessage: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

import { generateKeyPairSync } from 'crypto';

export function generateKeyPair() {
  return generateKeyPairSync('rsa', {
    modulusLength: 2048, // Key size
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
}
