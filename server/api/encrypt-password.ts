import bcrypt from 'bcryptjs';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const key = getRequestHeader(event, 'key')
  if (body.type == 'verify') {
    console.log('HERE')
    if (key === useRuntimeConfig().secret_header) {
      const pepper = useRuntimeConfig().pepper;
      console.log( body)
      return await verifyPassword(body.password, pepper, body.id);
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

async function verifyPassword(password: string, pepper: string, id: string) {
  const user = await prisma.users.findUnique({
    where: { uuid: id },
    select: { password: true },
  });

  if (!user) {
    console.log("User not found");
    return false;
  }

  console.log(password, user.password, pepper);

  const pepperedPassword = password + pepper;
  const isMatch = await bcrypt.compare(pepperedPassword, user.password);

  return isMatch;
}
