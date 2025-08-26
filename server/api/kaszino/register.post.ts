import { PrismaClient } from "@prisma/client";
import { emailRegex, passwordRegex } from "~/composables/defaults";
import { log } from "~/composables/log";
const p = new PrismaClient();


export default defineEventHandler(async(event) => {
  const body = await readBody(event);
  const data = body.data;

  const decrypted = await decryptServer(data);
  const userdata = JSON.parse(decrypted)

  if (!validateData(userdata)) {
    throw createError({
        statusCode: 402,
        statusMessage: 'Bad Request',
        message: 'Hibás formátumú adatok!'
    })
  }
  
  const existingUser = await p.kaszinoUser.findFirst({
    where: {
      OR: [
        { email: userdata.email },
        { username: userdata.username }
      ]
    },
    select: {
      username: true,
      email: true
    }
  })

  const emailExists = existingUser?.email === userdata.email

  if (emailExists) {
    throw createError({
        statusCode: 409,
        statusMessage: 'User already exists',
        message: 'Létezik már felhasználó ezzel az e-mail címmel.'
    })
  }
  const usernameTaken = existingUser?.username === userdata.username

  if (usernameTaken) {
    throw createError({
        statusCode: 409,
        statusMessage: 'User already exists',
        message: 'A felhasználónév már foglalt.'
    })
  }
  


  const returndata = await $fetch('/api/encrypt-password', {
    method: 'POST',
    headers: { key: useRuntimeConfig().secret_header },
    body: {
      password: userdata.password,
    }
  })
  const hashedPassword = typeof returndata === 'object' && returndata !== null && 'hashedpass' in returndata
    ? (returndata as { hashedpass: string }).hashedpass
    : null;

  if (!hashedPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Password hashing failed',
      message: 'Nem sikerült a jelszó titkosítása.'
    });
  }

  const result = await p.kaszinoUser.create({
    data: {
      fullName: userdata.fullname,
      username: userdata.username,
      email: userdata.email,
      uuid: crypto.randomUUID(),
      password: hashedPassword
    }
  })

    log.infoPublic({
      title: 'Casino account created',
      type: 'new_casino_account',
      message: 'A felhasználó nyert a keréken.',
      data: {
        result
      }
    });
  return {status: 'success', message: 'Fiók sikeresen létrehozva!'}

})

const validateData = (userdata:any):boolean => {

  if (userdata.username.length >= 12 || userdata.username.length <= 3 || !emailRegex.test(userdata.email) || !passwordRegex.test(userdata.password)) {
    return false
  }
  return true
}