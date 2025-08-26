export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/kaszino')) return

  const accessTokenCookie = useCookie('accessTokenCasino')
  if (!accessTokenCookie.value) {

  
    return await navigateTo('/kaszino/login')
  }
  const isTokenValid = async():Promise<boolean> => {
    try {
      const result = await $fetch('/api/kaszino/verifyJWT', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessTokenCookie.value}`
        }
      })
      return true
    } catch (error) {
      return false
    }
  }
  if (!(await isTokenValid())) {

    try {
      const result = await $fetch('/api/kaszino/genAccessToken', {
        method: 'GET',
        credentials: 'include'
      })
      if (result.status !== 'success') {
        accessTokenCookie.value = undefined;
        return await navigateTo('/kaszino/login')
      }
    } catch (error) {
      accessTokenCookie.value = undefined;
      return await navigateTo('/kaszino/login')
    }
  }
  return
})
