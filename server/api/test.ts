import { PrismaClient } from '@prisma/client';
import { getuid } from 'process';

const prisma = new PrismaClient();

async function main() {
  try {
    const newUser = await prisma.stabtagok.create({
      data: {
        uuid: 'uuid', // Generate a random UUID
        dob: new Date('2000-05-15'), // Example Date of Birth
        school: 'Budapest High School',
        paidcash: 2000,
        post: 'Team Leader',
        email: 'testuser@example.com',
        phone: '1234567890',
        city: 'Budapest',
      },
    });

    console.log('Inserted user:', newUser);
  } catch (error) {
    console.error('Error inserting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

//main();
async function getUser() {
  try {
    const result = await prisma.stabtagok.findMany({})
    console.log(result)
  } catch (error) {
    console.error(error);
    
  }
}

//getUser();