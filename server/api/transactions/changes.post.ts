import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export default defineEventHandler(async (event) => {
  const token = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];
  // Check if the request is authorized
  const isvalidJWT = await $fetch('/api/verifyJWT', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`
    }
  });
  if (!isvalidJWT) {
    console.error('Unauthorized request');
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid token',
    })  
    
  }
  
  const body = await readBody(event);
  const change = body.amount;
  const type = body.type || '';
  console.log('TYPE: ', type);
  console.log('CHANGE: ', change);
  
  

  if (typeof change !== 'number' || !Number.isInteger(change)) { 
    console.error('Invalid amount type');
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid amount type',
      message: 'Amount must be an integer',
    })
  }

  try {
    prisma.$connect();
    const result = await prisma.stabcash.upsert({
      where: { id: 1 },
      update: type === 'stabcashChange'
        ? { balance: { increment: BigInt(change) } }
        : {
            balance: { increment: BigInt(change) },
            income: change > 0 ? { increment: change } : undefined,
            expense: change < 0 ? { increment: Math.abs(change) } : undefined
          },
      create: {
        id: 1,
        balance: BigInt(0),
        income: type === 'stabcashChange' ? 0 : (change > 0 ? change : 0),
        expense: type === 'stabcashChange' ? 0 : (change < 0 ? Math.abs(change) : 0)
      },
    });
    
    return {
      message: 'Balance updated successfully',
      balance: Number(result.balance),
    };
  } catch (error:any) {
    throw createError({
        statusCode: 500,
        statusMessage: 'Error in updating balance',
        message: error.message,
    })
  } finally {
    await prisma.$disconnect();
  }

});

