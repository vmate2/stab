// server/plugins/auth-user.ts

//import { H3Event } from 'h3'
//import type { UserPayload } from '~~/types/userPayload'
//
//export default defineEventHandler(async (event: H3Event) => {
//  const token = getCookie(event, 'token')
//  if (!token) return
//
//  try {
//    const payload = await $fetch('/api/verifyJWT', {
//      method: 'POST',
//      headers: {
//        authorization: `Bearer ${token}`,
//      },
//    })
//
//    const uuid = payload.payload.userId
//
//    const userData = await $fetch<UserPayload>('/api/users', {
//      method: 'POST',
//      headers: {
//        authorization: `Bearer ${token}`,
//      },
//      body: { uuid },
//    })
//
//    event.context.authUser = userData
//
//    // Logolás a `serverlog`-on keresztül
//    const serverlog = event.context.nuxtApp.$serverlog
//    await serverlog.log(
//      event,  // Event, amit logolunk
//      'User Action',  // Cím
//      'UserAuthenticated',  // Típus
//      { userData }  // Logolt adat
//    )
//  } catch (e) {
//    console.warn('Could not attach user to event.context:', e)
//  }
//})
//

export default defineEventHandler(async (event) => {
});