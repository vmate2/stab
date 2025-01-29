import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const key = getRequestHeader(event, 'key')
  if (body.type == 'verify') {
    if (key === useRuntimeConfig().secret_header) {
      const pepper = useRuntimeConfig().pepper;
      return await verifyPassword(body.password, body.hashedPassword, pepper);
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

  } else {
    if (!body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password is required',
      });
    }

    const PEPPER = useRuntimeConfig().pepper;
    if (!PEPPER) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Server configuration error: PEPPER is missing',
      });
    }

    // Hash the password with bcrypt
    const hashedPassword = await hashPassword(body.password, PEPPER);

    return { hashedpass: hashedPassword };
  }
});

async function hashPassword(password: string, pepper: string) {
  const pepperedPassword = password + pepper;
  const hashedPassword = await bcrypt.hashSync(pepperedPassword, 10);
  return hashedPassword;
}

async function verifyPassword(password: string, hashedPassword: string, pepper: string) {
  const pepperedPassword = password + pepper;
  const isMatch = await bcrypt.compareSync(pepperedPassword, hashedPassword);
  return isMatch;
}