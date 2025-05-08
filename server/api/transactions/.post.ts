import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Transaction {
  id: string;
  name: string;
  type: number;
  amount: number;
  date: Date;
  description: string | undefined;
  picture: File | undefined;
  category: string;
  userId: string;
}

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
  try {
    const transaction: Transaction = {
      id: body.transaction.id.toString(),
      date: body.transaction.date,
      amount: body.transaction.amount,
      type: body.transaction.type,
      category: body.transaction.category,
      name: body.transaction.name,
      description: body.transaction.desc || '',
      picture: body.transaction.picture || '',
      userId: body.transaction.userId,
    };

    console.log('Transaction: ', transaction);

    const doesExist = await prisma.transactions.findUnique({
      where: {
        id: transaction.id.toString(),
      },
    });
    if (doesExist) {
      console.error('Transaction already exists');
      throw createError({
        statusCode: 400,
        statusMessage: 'Transaction already exists',
        message: 'Transaction already exists',
      })
    }

    let change;
    if (Number(transaction.type) === 1) {
      change = Number(transaction.amount);
    } else {
      change = -(Number(transaction.amount) || 0);
    }

    console.warn('Change: ', change);
    
    
    const changeResult = await $fetch('/api/transactions/changes', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${token}`
      },
      body: {
        amount: change,
        type: Number(transaction.type) === 1 ? 'income' : 'expense'
      }
    });

    if (changeResult) {
      console.log('Change result: ', changeResult);
    } else {
      console.error('Error in change result');
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request',
        message: 'Error in change result',
      })
    }

    const result = await prisma.transactions.create({
      data: {
        id: transaction.id.toString(),
        type: Number(transaction.type),
        title: transaction.name,
        amount: Number(transaction.amount),
        category: transaction.category,
        date: transaction.date,
        desc: transaction.description,
        userId: transaction.userId,
      },
    });

    console.log('RESULT OF CREATION: ', result);

    if (result) {
      console.log('Transaction created successfully');
      
      return {
        message: 'Transaction created successfully',
        transaction: result,
      };
    } else {
      console.error('Error in creating the transaction');
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
        message: 'Error in creating the transaction',
      })
    }
    

  } catch (error) {
    console.error('Error in creating the transaction:', error);
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request',
      message: 'Error constructing the transaction',
    })
    
  }


})
