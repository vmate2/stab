import { getCookie, createError } from 'h3'

export async function handleToken(event: any): Promise<{ token: string, username: string }> {
  let accessToken = getCookie(event, 'accessTokenCasino')
  let payload: any = null

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Nincs token'
    })
  }

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response: any = await $fetch('/api/kaszino/verifyJWT', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      payload = response
      console.log('PAYLOAD in HandleToken: ', payload);
      
      return !!response
    } catch {
      return false
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshRes: any = await $fetch('/api/kaszino/genAccessToken', {
        method: 'GET',
        headers: { Cookie: `accessTokenCasino=${accessToken}` }
      })
      if (refreshRes.status === 'success') {
        // get new token from cookie
        accessToken = getCookie(event, 'accessTokenCasino')
        // verify new token
        return await verifyToken(accessToken)
      }
      return false
    } catch {
      return false
    }
  }

  const valid = await verifyToken(accessToken) || await refreshToken()

  if (!valid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Érvénytelen token'
    })
  }
  console.log('payload2:', payload);
  
  return {
    token: accessToken,
    username: payload.username
  }
}

export type user = {
  username: string;
  fullName: string;
  email: string;
  uuid: string;
}
