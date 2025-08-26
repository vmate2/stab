import { PrismaClient } from "@prisma/client";
import { emailRegex, passwordRegex } from "~/composables/defaults";
import { log } from "~/composables/log";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
const p = new PrismaClient();

const REFRESH_SECRET = useRuntimeConfig().refreshSecret;
const pepper = useRuntimeConfig().pepper;

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
      username: userdata.username
    }
  })

  if (!existingUser) {
    throw createError({
        statusCode: 409,
        statusMessage: 'User already exists',
        message: 'A felhasználó nem létezik.'
    })
  }



  const validateCredentials = async () => {
      const pepperedPassword = userdata.password + pepper;
      const isMatch = await bcrypt.compare(pepperedPassword, existingUser.password);
      return isMatch;
  }


    if (!await validateCredentials()) {
      throw createError({
          statusCode: 402,
          statusMessage: 'Bad request',
          message: 'Hibás jelszó!'
      })
    }


    log.infoPublic({
      title: 'New login into casino account',
      type: 'login_casino_account',
      message: 'Új bejelentkezés a kaszinó fiókba',
      data: {
        existingUser
      }
    });

  const generateRefreshToken = (user: {
    username: string
    email: string
    fullname: string
    uuid: string
  }) => {
    return jwt.sign(
      {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        fullname: user.fullname
      },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    )
  }
  const refreshToken = generateRefreshToken({username: existingUser.username, uuid: existingUser.uuid, email: existingUser.email, fullname: existingUser.fullName})
  console.log('created refreshToken: ', jwt.verify(refreshToken, REFRESH_SECRET));
  
  setCookie(event, 'refreshTokenCasino', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
    sameSite: 'lax',
    path: '/'
  })
  
  return { status: 'success', message: 'Sikeres bejelentkezés!' }

})

const validateData = (userdata:any):boolean => {
  
  
  if (userdata.username.length >= 12 || userdata.username.length <= 3 || !passwordRegex.test(userdata.password)) {
    return false
  }
  return true
}
