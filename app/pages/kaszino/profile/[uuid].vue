<template>
	<div class="mainBg">
		<nav>
      <ul>
        <li>
          <NuxtLink :to="`/kaszino/profile/${user?.uuid}`">Adataim</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="`/kaszino/profile/${user?.uuid}/stats`">Statisztika</NuxtLink>
        </li>
        <li v-if="isOwnProfile" style="color: red;">
          <NuxtLink :to="`/kaszino/profile/${user?.uuid}/torles`" style="color: red;">Törlés</NuxtLink>
        </li>
      </ul>
		</nav>
		<section>
      <NuxtPage />
    </section>
	</div>
</template>

<script lang="ts" setup>

definePageMeta({
	layout: 'casino'
})

const route = useRoute();

import { useCurrentUser } from '@/composables/currentUser'
const { user, loading, error, fetchCurrentUser, fetchUser } = useCurrentUser()

const routeUuid = computed(() => route.params.uuid as string | undefined)
import { ref, watch } from 'vue'
const loggedUser = ref<any>(null)

async function loadProfile() {
  // do not clear existing `user` immediately — keep current UI until we have a new profile
  loading.value = true
  try {
    const loggedInUser = await fetchCurrentUser().catch(() => null)
    loggedUser.value = loggedInUser || null

    const targetUuid = routeUuid.value || loggedUser.value?.uuid
    if (targetUuid) {
      const fetched = await fetchUser(targetUuid).catch(() => null)
      if (fetched) {
        // fetchUser already assigns into `user`, but ensure the ref is set
        user.value = fetched
      } else {
        // if fetch failed but the requested uuid equals the logged-in user, keep loggedUser in UI
        if (loggedUser.value && loggedUser.value.uuid === targetUuid) {
          user.value = loggedUser.value
        } else {
          // otherwise clear user to indicate not found
          user.value = null
        }
      }
    }
  } finally {
    loading.value = false
      if (!isOwnProfile.value) {
    console.log('Not own profile, setting loading to false')
    loading.value = false
    navigateTo('/kaszino')
  }
  }

  // debug
  console.log('fetched profile:', user.value)
  console.log('isOwnProfile:', isOwnProfile.value)
  console.log('routeUuid:', routeUuid.value)
}

onMounted(() => {
  void loadProfile()
})

// react to route changes (client-side navigation) and reload the profile
watch(routeUuid, (newVal, oldVal) => {
  if (newVal !== oldVal) void loadProfile()
})

// helper that indicates if the profile belongs to the current logged-in user
const isOwnProfile = computed(() => {
  // if routeUuid exists, compare it to the logged-in user's uuid
  if (routeUuid.value) return loggedUser.value?.uuid === routeUuid.value
  // if no route param, compare the fetched profile (user) to the logged-in user
  return !!loggedUser.value && user.value?.uuid === loggedUser.value.uuid
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap');

.mainBg {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}



section {
  flex: 1;             /* a maradék helyet kitölti */
  height: 90vh;
}



nav {
  flex: 0 1 15%;
  max-width: 15%;
  min-width: 180px; /* olvasható legyen kisebb kijelzőn is */
  background: linear-gradient(180deg, #2a2a2a, #181818);
  height: 90vh;
  border-right: 2px solid #5a1d1a; /* bordó csík */
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-top: 2rem;
  box-shadow: 2px 0 8px rgba(0,0,0,0.4);
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

nav a {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: #ddd;
  padding: 12px 20px;
  margin: 4px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
}

nav a:active {
  background-color: #5a1d1a; /* bordó a stáb színével (#420C09-hoz közel) */
  color: #fff;
  font-weight: 700;
}

nav ul li {
  margin: 4px 0;
}

nav ul li a {
  display: block;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: #ddd;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
}

nav ul li a:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
}

nav ul li a:active {
  background-color: #5a1d1a;
  color: #fff;
  font-weight: 700;
}


</style>
