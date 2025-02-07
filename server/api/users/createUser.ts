import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return await createNewTag(body.nev, body.poszt, body.email, body.telefonszam);
  
});

async function createNewTag(nev:string, poszt:string, email:string, telefonszam:any) {
  const userData = await generateUser();
  const stabtagData = await createStabtag(userData.id, nev, poszt, email, telefonszam);
  if (stabtagData.success == false) {
    return {userData, stabtagData};
  } else {
    return userData;
  }

}

async function generateUser() {
  const username = generateRandomString(20);
  const password = generateRandomString(10);
  const id = crypto.randomUUID();

  try {
    const { hashedpass } = await encryptPassword(password);
    const storeResponse = await store(id, username, hashedpass);

    if (storeResponse.success) {
      return {success: true, id, username, password };
    } else {
      return {success: false}
    }
  } catch (error) {
    console.error('Error generating user:', error);
    throw error; // Re-throw the error to propagate it
  }
}

function generateRandomString(length:number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

async function encryptPassword(password: string) {
  const { hashedpass, salt } = await $fetch<EncryptPasswordResponse>('/api/encrypt-password', {
    method: 'POST',
    body: { password }, // Send as an object
  });

  return { hashedpass, salt };
}

async function store(id: string, username: string, hashedpass: string) {

  try {
    const newUser = await prisma.users.create({
      data: {
        uuid: id,
        username: username,
        password: hashedpass,
      },
    });

    console.log('Inserted user:', newUser);
    return {success: true}
  } catch (error) {
    console.error('Error inserting user:', error);
  } finally {
    await prisma.$disconnect();
  }
};

async function createStabtag(id:string, nev:string, poszt:string, email:string, telefonszam:string) {
/*
                 ____________________________________
                /                                    \
               |                REGEX                 |
                \____________________________________/
*/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const nameRegex = /^[A-Za-záéíóöőúüűÁÉÍÓÖŐÚÜŰ-]+$/;
const phoneRegex = /^\+?[0-9\s\-()]{11,}$/;
const posztRegex = nameRegex;

  const names = nev.trim().split(/\s+/);
  const vnev = names[0];
  const knev = names.length > 1 ? names[names.length - 1] : '';

  if (nameRegex.test(vnev) && nameRegex.test(knev) && posztRegex.test(poszt) && emailRegex.test(email) && phoneRegex.test(telefonszam) && email.length > 10 && email.length < 120 && telefonszam.length < 15 && vnev.length < 20 && knev.length < 20) {
    try {
      const result = await prisma.stabtagok.create({
        data: {
          uuid: id,
          name: nev,
          post: poszt,
          email: email,
          phone: telefonszam,
        },
      });
      return {success: true, message: 'Sikeresen létrehozva!'}
    } catch (e) {
      console.error(e)
      return {success: false, message: e}
    }
  } else {
    return {success: false, message: 'A megadott adatok nem valósak!'}
  }
  
}

interface EncryptPasswordResponse {
  hashedpass: string;
  salt: string;
}