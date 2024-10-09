import { PrismaClient } from '@prisma/client';
import { baseEnc, baseDec } from './encrypt';
import crypto from 'crypto';
const prisma = new PrismaClient();


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log('Request Body:', body); // Log the body for debugging
  switch (body.type) {
    case 'login':
      const encryptedPassword = await encryptPassword(body.password);
      console.log('Encrypted Password:', encryptedPassword);
      return await attempLogin(encryptedPassword, baseDec(body.username));
    case 'test':
      return 'wow';
    default:
      return 'not wow';
  }
});


async function encryptPassword(password:string) {
  return await $fetch('/api/encrypt', {
    method: 'POST',
    body: {
      type: 'encPassword',
      password: password
    }
  })
}

async function attempLogin(password:any, username:string) {
  console.log('login.ts:', username, password.encryptedPassword)
  /*try {
    await prisma.$connect();
    const data:any = await prisma.users.findMany({
      where: {
        username: username,
        password: password.encryptedPassword
      }
    });
    if (data[0]) {
      console.log(data)
      return true;
    } else {
      console.log('none found')
      console.log(data)
      return false;
    }
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }*/
 return true;
}


async function genAcc(role: string, name: string) {
  const secretKey: string = process.env.SHA256KEY || '';
  let roleLevel;
  switch (role) {
    case 'stábtag':
      roleLevel = 0;
      break;
    case 'kisfőnök':
      roleLevel = 1;
      break;
    case 'kampányfőnök':
      roleLevel = 2;
      break;
    case 'jelölt':
      roleLevel = 3;
      break;
    case 'admin':
      roleLevel = 4;
      break;
  }

  const firstTwo = role.substring(0, 2);
  const lastTwo = role.substring(role.length - 2);

  const nameHex = Buffer.from(name, 'utf8').toString('hex');

  const combinedString = `${firstTwo}${nameHex}${lastTwo}`;

  const hashedId = crypto.createHmac('sha256', secretKey)
    .update(combinedString)
    .digest('hex');

  const userId = `${hashedId}${roleLevel}`;

  return userId;
}

(async () => {
  const role = "admin"; // Example role
  const name = "vmate"; // Example name
  const userId = await genAcc(role, name);
  console.log("Generated User ID:", userId);
})();

/*async function insertUser() {
  const username = "vmate";
  const password = "21a7e97d9f90d955198ab9a2966c0ccadd721effb638ac437f612547f90e8b10"; // Your password
  const userid = "cf0cd9624febe3a874b078bcb6f4e094f8ea70c4134d7d41ae013e47d3a9b9854"; // Generated user ID
  const accesstoken = null; // Access token, set to null

  try {
    const newUser = await prisma.users.create({
      data: {
        username: username,
        password: password,
        userid: userid,
        accesstoken: accesstoken,
      },
    });
    
    console.log("User inserted:", newUser);
  } catch (error) {
    console.error("Error inserting user:", error);
  }
}*/

//insertUser()