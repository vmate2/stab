// server/api/log.ts
import { defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Ellenőrizzük, hogy a szükséges adatok megvannak
  if (!body.level || !body.title || !body.type || !body.userData) {
    throw createError({ statusCode: 400, message: 'Invalid log data' });
  }

  // Hívjuk meg a logger funkciót, ami szerver oldalon elérhető
  const { serverlog } = event.context.nuxtApp.$serverlog
  await serverlog.log(
    event, // Itt továbbra is szükséges az 'event' objektum
    body.title,
    body.type,
    body.userData
  );

  try {
    await prisma.log.create({
      data: {
        title: body.title,
        type: body.type,
        level: body.level,
        data: body.userData,
        userId: body.userId || null,
        username: body.username || null,
        ip: body.ip || null,
        timestamp: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Error logging data' });
  }
});
