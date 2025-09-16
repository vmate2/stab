import { ref } from 'vue'

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useCurrentUser() {
  async function fetchCurrentUser() {
    loading.value = true
    error.value = null
    try {
      const accessToken = useCookie('accessTokenCasino').value

      if (!accessToken) throw new Error('No access token')

      const res: any = await $fetch('/api/kaszino/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      // guard: sometimes the server may return an HTML error page (string) instead of JSON
      if (typeof res === 'string' && res.trim().startsWith('<')) {
        throw new Error('Invalid HTML response from user API')
      }
      if (!res || typeof res !== 'object' || !res.uuid) {
        throw new Error('Invalid user payload from API')
      }

      user.value = res as User
      return user.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch user'
      user.value = null
    } finally {
      loading.value = false
    }
  }
  
  async function fetchUser(uuid: string) {
    loading.value = true
    error.value = null
    try {
      const accessToken = useCookie('accessTokenCasino').value
      if (!accessToken) throw new Error('No access token')
      const res: any = await $fetch(`/api/kaszino/user/${uuid}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      // guard against HTML error pages or malformed payloads
      if (typeof res === 'string' && res.trim().startsWith('<')) {
        throw new Error('Invalid HTML response from user API')
      }
      if (!res || typeof res !== 'object' || !res.uuid) {
        throw new Error('Invalid user payload from API')
      }

      user.value = res as User
      return user.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch user'
      user.value = null
    } finally {
      loading.value = false
    }
  }
  return { user, loading, error, fetchCurrentUser, fetchUser }
}

type User = {
  username: string;
  fullName: string;
  email: string;
  uuid: string;
  balance: number;
}
