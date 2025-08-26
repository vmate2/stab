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

      const res = await $fetch<User>('/api/kaszino/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      user.value = res
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
      const res = await $fetch<User>(`/api/kaszino/user/${uuid}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      user.value = res
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
