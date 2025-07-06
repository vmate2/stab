<template>
  <div v-if="!userAgreed" @click="startMap" class="button">Térkép megjelenítése</div>
  <div v-if="userAgreed" class="mapCont">
    <div ref="mapElement" class="map"></div>
  </div>
</template>

<script setup lang="ts">
await import('leaflet/dist/leaflet.css')

definePageMeta({ layout: 'new' })

import { ref, nextTick, watch, onUnmounted } from 'vue'
import { useCookie } from '#imports'
import { useAuth } from '~/composables/useAuth'

const userAgreed = ref(false)
const mapElement = ref<HTMLDivElement | null>(null)
const map = ref<any>(null)
const markers = new Map<string, any>() // userID -> marker

const { token, user } = useAuth()
let L: any = null

const getColorByTimeDiff = (minutes: number, isSelf: boolean) => {
  if (isSelf) return '#007bff' // kék

  if (minutes < 60) return 'green'
  else if (minutes < 180) return 'yellow'
  else if (minutes < 300) return 'red'
  else return 'black'
}

const timeAgoText = (updatedAt: string) => {
  const updatedDate = new Date(updatedAt)
  const diffMs = Date.now() - updatedDate.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return 'Most frissítve'
  if (diffMinutes < 60) return `${diffMinutes} perccel ezelőtt`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} órával ezelőtt`
  return updatedDate.toLocaleString()
}

const { data, status, error, refresh } = await useFetch('/api/locations', {
  method: 'GET',
  headers: {
    authorization: `Bearer ${useCookie('refreshToken').value}`,
  }
})

if (error.value) console.error(error.value)

const updateMarkers = () => {
  if (!map.value || !data.value) return

  const currentIds = new Set<string>()
  data.value.forEach((element: any) => {
    const id = element.userID
    currentIds.add(id)
    const isSelf = id === user.value.payload.userId
    const updatedDate = new Date(element.updatedAt)
    const diffMinutes = (Date.now() - updatedDate.getTime()) / 60000
    const color = getColorByTimeDiff(diffMinutes, isSelf)

    if (markers.has(id)) {
      // frissítés
      const marker = markers.get(id)
      marker.setLatLng([element.latitude, element.longitude])
      marker.setStyle({ fillColor: color })
      marker.setPopupContent(`${element.username}<br>${timeAgoText(element.updatedAt)}`)
    } else {
      // új marker
      const marker = L.circleMarker([element.latitude, element.longitude], {
        radius: 6,
        fillColor: color,
        color: '#ffffff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map.value)
      marker.bindPopup(`${element.username}<br>${timeAgoText(element.updatedAt)}`)
      markers.set(id, marker)
    }
  })

  // eltávolítjuk a már nem létező marker-eket
  for (const id of markers.keys()) {
    if (!currentIds.has(id)) {
      map.value.removeLayer(markers.get(id))
      markers.delete(id)
    }
  }
}

watch(data, () => {
  updateMarkers()
}, { immediate: true })

onUnmounted(() => {
  markers.forEach(m => map.value?.removeLayer(m))
  markers.clear()
  map.value?.remove()
})

const startMap = async () => {
  userAgreed.value = true
  await nextTick()

  if (!import.meta.client) return

  L = (await import('leaflet')).default

  if (!map.value) {
    map.value = L.map(mapElement.value!).setView([46.68077425851885, 21.09807547652077], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map.value)
  }

  updateMarkers()
}

// automatikus frissítés 5 percenként, ha térkép nyitva
let intervalId: any = null
watch(userAgreed, val => {
  if (val) {
    intervalId = setInterval(() => {
      refresh()
    }, 1000 * 60 * 5)
  } else if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.mapCont {
  width: 100%;
  height: 80vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.map {
  width: 80%;
  height: 100%;
}
.button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
