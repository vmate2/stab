import { defineEventHandler, readBody } from 'h3';
import crypto from 'crypto';

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  try {
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';

    // Remove the header, footer, and all whitespace (including newlines)
    const pemContents = pem
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, ''); // Remove all whitespace, including newlines


    // Decode the Base64 string
    const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
    // Import the private key
    const privateKey = await crypto.subtle.importKey(
      'pkcs8', // Use 'pkcs8' for private keys
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true, // Whether the key is extractable
      ['decrypt'] // Key usage for private key
    );

    return privateKey;
  } catch (error) {
    console.error('Error importing private key:', error);
    throw error;
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Import the private key
    const privateKey = await importPrivateKey(process.env.PRIVATE_KEY || '');

    // Decrypt the incoming message using the private key
    const decryptedMessage = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      Buffer.from(body.encryptedMessage, 'base64') // Use the encrypted message from the request body
    );

    // Convert the decrypted data to a string
    const decryptedText = new TextDecoder().decode(decryptedMessage);

    // Parse the JSON string back into an object
    const decryptedObject = JSON.parse(decryptedText);
    console.log('Decrypted object:', decryptedObject);

    return { decryptedMessage: decryptedObject };
  } catch (error) {
    console.error('Error in decryption:', error);
    throw new Error('Failed to process the request');
  }
});