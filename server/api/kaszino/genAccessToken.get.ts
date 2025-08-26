import jwt from 'jsonwebtoken'
import { getCookie, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  // Közvetlenül a cookie-ból olvasod a refresh tokent
  const refreshToken = getCookie(event, 'refreshTokenCasino')

  if (!refreshToken) {
    throw createError({ statusCode: 401, message: 'No refresh token in cookie' })
  }

  try {
    const payload = jwt.verify(refreshToken, useRuntimeConfig().refreshSecret!)
    console.log('payload: ', payload.uuid, payload.username);
    
    if (typeof payload === 'string' || !payload.uuid || !payload.username) {
      throw createError({ statusCode: 401, message: 'Invalid refresh token payload' })
    }

    const newAccessToken = jwt.sign(
      { uuid: payload.uuid, username: payload.username },
      useRuntimeConfig().jwtSecret!,
      { expiresIn: '15m' }
    )
    try {
      const payload2 = jwt.verify(newAccessToken, useRuntimeConfig().jwtSecret)
      console.log('Verified created jwt: ', payload2);
    } catch (error) {
      console.error(error)
    }
    setCookie(event, 'accessTokenCasino', newAccessToken, {
      httpOnly: false,
      sameSite: 'strict',
      secure: false,
      path: '/', // must be "/" if you want it everywhere
      maxAge: 60 * 15 // 15 min
    })

    return { status: 'success' }
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid refresh token' })
  }
})
