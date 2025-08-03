import { checkToken } from "~/composables/defaults"
import { PrismaClient } from "@prisma/client"

const p = new PrismaClient

export default defineEventHandler(async (event) => {
  const istokenvalid =  await checkToken(event)
  if (!istokenvalid) {
    console.error('Hibás token!')
    throw createError({
        statusCode: 401,
        statusMessage: 'Hibas Token'
    })
  }
  try {
    const result = await p.szponzorok.findMany({
      where: {
        email: {
          not: null
        }
      },
      select: {
        email: true,
        name: true,
        status: true,
        type: true
      }
    });
  
    return result
  } catch (error) {
    console.error(error)
    throw createError({
        statusCode: 500,
        statusMessage: 'Hiba lekerdezes soran.'
    })
  }


})
