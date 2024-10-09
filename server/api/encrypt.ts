import crypto from 'crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  switch (body.type) {
    case 'encPassword':
      // Await the result of encPassword to get the resolved value
      const encryptedPassword = await encPassword(baseDec(body.password));
      return { encryptedPassword }; // Return the encrypted password
  }
});

async function encPassword(initPass: string) {
  const secretKey: any = process.env.SHA256KEY;

  const hexPass = Buffer.from(initPass, 'utf8').toString('hex');

  const binPass = hexToBinary(hexPass);

  const halfLength = Math.floor(binPass.length / 2);
  const firstHalf = binPass.slice(0, halfLength);
  const secondHalf = binPass.slice(halfLength);

  const invertedFirstHalf = invertBinary(firstHalf);

  const modifiedBinPass = invertedFirstHalf + secondHalf;

  // Await the result of encryptPassword
  const encrypted = await encryptPassword(modifiedBinPass, secretKey); 

  return encrypted; // Return the encrypted password
}

function hexToBinary(hex: string) {
  return hex.split('')
    .map((char) => parseInt(char, 16).toString(2).padStart(4, '0'))
    .join('');
}

function invertBinary(bin: string) {
  return bin.split('')
    .map((bit) => (bit === '0' ? '1' : '0'))
    .join('');
}

async function encryptPassword(password: string, key: string) {
  const hash = crypto.createHmac('sha256', key)
    .update(password)
    .digest('hex');

  return hash; // Return the hash directly
}

export function baseDec(val: string) {
  const bytes = Buffer.from(val, 'hex');

  const shiftedBytes = bytes.map(byte => byte - 8);
  
  const utf8String = Buffer.from(shiftedBytes).toString('utf8');

  return utf8String;
}

export function baseEnc(val: string) {
  const bytes = Buffer.from(val, 'utf8');

  const shiftedBytes = bytes.map(byte => byte + 8);
  
  const hexValue = Buffer.from(shiftedBytes).toString('hex');

  return hexValue;
}