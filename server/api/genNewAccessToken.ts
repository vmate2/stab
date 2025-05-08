import { SignJWT, jwtVerify } from 'jose';



export default defineEventHandler(async (event) => {

const token = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];
if (!token) {
  throw createError({
    statusCode: 401,
    statusMessage: 'Hozzáférés megtagadva!',
});
}
try {
  const runtimeConfig = useRuntimeConfig();
  const secretKey = new TextEncoder().encode(runtimeConfig.jwtSecret);

  const { payload } = await jwtVerify(token, secretKey);
  console.log('Decoded Payload:', payload);

  // Generate a new access token
  const newAccessToken = await new SignJWT({ userId: payload.userId, username: payload.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey);

  return { accessToken: newAccessToken };
} catch (error:any) {
  console.error('Token verification error:', error);

  if (error.code === 'ERR_JWT_EXPIRED') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Hozzáférés megtagadva! A token lejárt!',
    });
  } else if (error.code === 'ERR_JWS_INVALID') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Hozzáférés megtagadva! Hibás token!',
    });
  } else {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
}


})
