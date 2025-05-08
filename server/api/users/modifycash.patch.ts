import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

  const token = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];
  console.log("Token in modifycash: ", token);
  
  const isvalidJWT = await $fetch('/api/verifyJWT', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  if (!isvalidJWT) {
    console.error("Invalid JWT: ", isvalidJWT);
    throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
    })
  }

  const body = await readBody(event);
  const change = body.amount;

  if (typeof change !== 'number' || !Number.isInteger(change)) {
    console.error("Invalid amount: ", change);
    throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Amount must be an integer number',
    })
  }

  try {
    console.log('BODY: ', body, change);
    const previouscashRecord = await prisma.stabtagok.findUnique({
      where: { uuid: body.uuid },
      select: { paidcash: true },
    });

    if (!previouscashRecord) {
      console.error("User not found or paidcash");
      throw createError({
          statusCode: 404,
          statusMessage: 'Not Found',
          message: 'User not found or paidcash',
      })
    }

    const previouscash: number = previouscashRecord.paidcash || 0;
    const newchange = change - previouscash;

    // Send newchange to another API (await the response if necessary)
    console.log("New Change: ", newchange);
    
    if (!body.type) {
      console.warn("No type provided for modifycash! \n Procceding but not recommended");
    }

    const transactionResponse = await $fetch('/api/transactions/changes', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'source': 'stabtagok',
      },
      body: {
        amount: newchange,
        type: body.type || '',
      },
    });

    console.log("Transaction Response: ", transactionResponse);
    

    const result = await prisma.stabtagok.update({
      where: { uuid: body.uuid },
      data: { paidcash: change },
    });

    if (!result) {
      console.error("User not found at update");
      
      throw createError({
          statusCode: 404,
          statusMessage: 'Not Found',
          message: 'User not found',
      })
    }

    return {
      message: 'User balance updated successfully',
      balance: result.paidcash,
    };

  } catch (error: any) {
    console.error("Error in updating user balance: ", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error in updating user balance',
      message: error.message,
    });
  }
  finally {
    await prisma.$disconnect();
  }
});
