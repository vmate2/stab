import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.email || !body.phone || !body.post) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Missing required fields',
    });
  }
  const token:any = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Token is missing',
    });
  }

  try {
    const response = await $fetch('/api/verifyJWT', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (response) {
      const username = generateRandomString(20);
      const password = generateRandomString(10);
      let id = crypto.randomUUID();

      const { hashedpass } = await encryptPassword(password);

      let doesExist = await checkIfIDExists(id);

      const doesUserAlreadyExist = await doesUserExist(body);
      if (doesUserAlreadyExist) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Ez az email vagy telefonszám már foglalt!'
        })
      }

      while (doesExist) {
        id = crypto.randomUUID();
        console.log('creating new user, ID: ', id);
        doesExist = await checkIfIDExists(id);
        console.log('does user exist?', doesExist);
      }



      const user = await p.users.create({
        data: {
          uuid: id,
          username: username,
          password: hashedpass,
          createdAt: new Date(),
        },
      });
      const stabtag = await p.stabtagok.create({
        data: {
          uuid: id,
          name: body.name,
          email: body.email,
          phone: body.phone,
          post: body.post,
        },
      });

      if (user && stabtag) {
        await $fetch('/api/sendmail', {
          method: 'POST',
          body: {
            type : 'newUser',
            email: body.email,
            subject: 'Fiók létrehozva - Trefort Stáb',
            text: ` Kedves ${body.name}! \n\n Sikeresen létrehoztuk a felhasználói fiókodat! \n Az alábbi adatokkal tudsz belépni: \n Felhasználónév: ${username} \n Ideiglenes jelszó: ${password} \n\nKérlek, változtasd meg a jelszavadat a bejelentkezés után! \n\n Üdvözlettel: \n Trefort Stáb`,
            html: `
              <div style="background-color:#8B0000; color:white; font-family:Arial, sans-serif; padding:20px; max-width:600px; margin:auto; border:4px solid gold; border-radius:10px;">
                <h1 style="text-align:center; color:gold; margin-top:0;">🎰 FinalDeal 🎰</h1>
                <h2 style="text-align:center; color:white; margin:0;">Fiók létrehozva - Trefort Stáb</h2>

                <p style="font-size:16px;">Kedves <strong>${body.name}</strong>!</p>

                <p style="font-size:16px;">Sikeresen létrehoztuk a felhasználói fiókodat. Az alábbi adatokkal tudsz belépni:</p>

                <div style="background-color:black; color:white; padding:15px; border:2px solid gold; border-radius:8px; font-size:16px; margin:20px 0;">
                  👤 <strong>Felhasználónév:</strong> ${username}<br/>
                  🔐 <strong>Ideiglenes jelszó:</strong> ${password}
                </div>

                <p style="font-size:16px; color:#FFD700;"><strong>⚠️ Fontos:</strong> Kérlek, változtasd meg a jelszavadat az első bejelentkezés után!</p>

                <p style="font-size:16px;">Üdvözlettel,<br/>Trefort Stáb</p>

                <p style="font-size:14px; text-align:center; color:white;">© ${new Date().getFullYear()} FinalDeal • Trefort</p>
              </div>
            `
          }
      });
        return {
          status: 200,
          message: 'User created successfully',
        };
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          message: 'Failed to create user',
        });
      }
  
    }
  } catch (e: any) {
    console.error('Hiba a createNewUser API-ban:', e);

    throw createError({
      statusCode: e.statusCode || 500,
      statusMessage: e.statusMessage || 'Internal Server Error',
      message: e.message || JSON.stringify(e),
    });
  }

})


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
    body: { password },
  });

  return { hashedpass, salt };
}

interface EncryptPasswordResponse {
  hashedpass: string;
  salt: string;
}


async function checkIfIDExists(id: string) {
  const user = await p.users.findUnique({
    where: {
      uuid: id,
    },
  });

  return user !== null;
}

async function doesUserExist(userData: any) {
  const user = await p.stabtagok.findFirst({
    where: {
      OR: [
        { email: userData.email },
        { phone: userData.phone }
      ]
    }
  });

  return user !== null;
}
