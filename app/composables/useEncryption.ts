import { useRuntimeConfig } from '#imports';

export function useEncryption() {
  const rtcfg = useRuntimeConfig();

  // Function to import the public key
  async function importPublicKey(pem: string): Promise<CryptoKey> {
    try {
      const pemHeader = '-----BEGIN PUBLIC KEY-----';
      const pemFooter = '-----END PUBLIC KEY-----';

      // Remove the header, footer, and all whitespace (including newlines)
      const pemContents = pem
        .replace(pemHeader, '')
        .replace(pemFooter, '')
        .replace(/\s/g, '')
        .trim(); // Remove all whitespace, including newlines

      // Decode the Base64 string
      const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

      // Import the public key
      const publicKey = await crypto.subtle.importKey(
        'spki',
        binaryDer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        true,
        ['encrypt']
      );
      return publicKey;
    } catch (error) {
      throw error;
    }
  }

  // Function to encrypt a message using the public key
  async function encryptMessage(message: string, publicKey: CryptoKey): Promise<string> {
    try {
      const encodedMessage = new TextEncoder().encode(message); // Convert string to Uint8Array
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        publicKey,
        encodedMessage
      );
      const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted))); // Convert to Base64
      return encryptedBase64;
    } catch (error) {
      console.error('Error encrypting message:', error);
      throw error;
    }
  }

  // Expose a function to encrypt any string
  async function encrypt(message: string): Promise<string> {
    try {
      // Import the public key
      const publicKey = await importPublicKey(rtcfg.public.publicKey || '');

      // Encrypt the message
      const encryptedMessage = await encryptMessage(message, publicKey);
      return encryptedMessage;
    } catch (error) {
      console.error('Error in encryption:', error);
      throw error;
    }
  }

  return {
    encrypt,
  };
}