import { PrismaClient } from "@prisma/client"
import { handleToken } from "~~/server/utils/handleToken"
const p = new PrismaClient();

export default defineEventHandler(async (event) => {
let payload;
  try {
       payload = await handleToken(event)
       console.log('PAYLOAD in user.get.ts: ', payload);
       
  } catch (error:any) {
    console.error(error)
    throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: error
    })
  }

  try {
    
      const userData = await p.kaszinoUser.findFirst({
      where: {
        username: payload.username
      },
      select: {
        username: true,
        uuid: true,
        email: true,
        fullName: true,
        zseton: true
      }
    })
    
      if (!userData) throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
      // Map zseton to balance
      const { zseton, ...rest } = userData
      return { ...rest, balance: zseton }
  } catch (error) {
    console.error(error)
    throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
    })
  }




})
