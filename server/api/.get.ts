import { jwtVerify } from 'jose';
import { createError } from 'h3';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

  const token:any = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Hozzáférés megtagadva!',
      message: 'Jelentkezz be újra, a token lejárt!'
    });
  }

  try {
    const runtimeConfig = useRuntimeConfig();
    const secretKey = new TextEncoder().encode(runtimeConfig.public.jwtSecret);

    const { payload } = await jwtVerify(token, secretKey);


    const users = await prisma.stabtagok.findMany({
      select: {
        id: true,
        name:true,
        post: true,
        email: true,
        phone: true,
        paidcash: true,
        school: true,
        city: true,
        uuid:true
      }
    });
    const sponsors = await prisma.szponzorok.findMany();
    const polorendeles = await prisma.polorendeles.findMany();

    const data = {users: users, sponsors:sponsors, polorendeles: polorendeles}

    return data;
    
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
        statusCode: 401,
        statusMessage: 'Hozzáférés megtagadva! Hibás token!',
      });
    }
  }
});