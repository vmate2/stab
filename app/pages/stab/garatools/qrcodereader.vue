<template>
  <div class="qr-reader-container">
    <div v-if="!hasCamera" class="error">Nem található kamera vagy nincs engedély.</div>
    <video v-show="hasCamera" ref="video" class="qr-video" autoplay playsinline></video>
    <div v-if="result" class="result">
      <div class="result-cont">
        <span class="result-text">Név: {{ result.name }}</span>
        <span class="result-text">Email: {{ result.email }}</span>
        <span class="result-text">Nyeremény: {{ result.type }}</span>
        <span v-if="result.amount > 1" class="result-text">Mennyiség: {{ result.amount }}</span>
        
      </div>
      <button class="reset-btn" @click="reset">Újraolvasás</button>
    </div>
      <div v-if="mainError" class="error-cont">
        <div>{{ mainError }}</div>
        <button class="reset-btn" @click="reset">Újraolvasás</button>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { BrowserQRCodeReader } from '@zxing/browser'

definePageMeta({ layout: 'new' })

const video = ref<HTMLVideoElement | null>(null)
const result = ref()
const mainError = ref(undefined)
const hasCamera = ref(true)
let codeReader: BrowserQRCodeReader | null = null
let stream: MediaStream | null = null
let controls: any = null // Store controls for cleanup

const { $notify } = useNuxtApp()

const reset = () => {
  mainError.value = undefined;
  result.value = null;
  if (codeReader && video.value) {
    if (controls) controls.stop(); // Stop previous scan if running
    codeReader.decodeFromVideoDevice(undefined, video.value, async (res, err, c) => {
        controls = c; // Save controls for cleanup
        if (res) {
          const {data, error} = await useFetch('/api/decryptQR', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
              'authorization': `Bearer ${useCookie('token').value}`
             },
            body: JSON.stringify(res.getText())
          })
          
          if (error.value) {
            console.warn('Error decrypting QR code:', error.value)
            mainError.value = error.value.data?.message ?? 'Ismeretlen hiba történt'
            $notify(error.value.data?.message ?? 'Ismeretlen hiba történt', 'error')
            return
          }

          result.value = data.value
          log.info({
            title: 'Win claimed',
            type: 'win_claimed',
            message: `Kerék nyeremény begyűjtve: ${res.getText()}`,
            data: data.value
          })
        }
    })
  }
}

onMounted(async () => {
  codeReader = new BrowserQRCodeReader()
  try {
    const devices = await BrowserQRCodeReader.listVideoInputDevices()
    if (!devices.length) {
      hasCamera.value = false
      return
    }
    if (video.value) {
      // Assign the stream to the variable so it can be stopped later
      codeReader.decodeFromVideoDevice(undefined, video.value, async (res, err, c) => {
        controls = c; // Save controls for cleanup
        // Save the stream reference if available
        if (video.value && video.value.srcObject instanceof MediaStream) {
          stream = video.value.srcObject as MediaStream
        }
        if (res) {
          const {data, error} = await useFetch('/api/decryptQR', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
              'authorization': `Bearer ${useCookie('token').value}`
             },
            body: JSON.stringify(res.getText())
          })
          if (data.value || error.value) {
            c.stop()
          }
          if (error.value) {
            console.warn('Error decrypting QR code:', error.value)
            mainError.value = error.value.data?.message ?? 'Ismeretlen hiba történt'
            $notify(error.value.data?.message ?? 'Ismeretlen hiba történt', 'error')
            return
          }

          result.value = data.value
          log.info({
            title: 'Win claimed',
            type: 'win_claimed',
            message: `Kerék nyeremény begyűjtve: ${res.getText()}`,
            data: data.value
          })
        }
      })
    }
  } catch (e) {
    hasCamera.value = false
  }
})

onBeforeUnmount(() => {
  if (controls) controls.stop(); // Stop QR code reader
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
.qr-reader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 60vh;
  padding: 2rem 0;
}
.qr-video {
  width: 340px;
  max-width: 90vw;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  margin-bottom: 1.5rem;
}
.result {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  color: #222;
  background: #fffbe0;
  border-radius: 10px;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.result-text {
  font-weight: bold;
  color: #007a3d;
  margin-top: 0.5rem;
  word-break: break-all;
}
.result-cont {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.reset-btn {
  margin-top: 1rem;
  background: #FFD700;
  color: #222;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.reset-btn:hover {
  background: #ffe066;
}
.error {
  color: #b30000;
  background: #fff0f0;
  padding: 1rem 2rem;
  border-radius: 10px;
  margin-top: 2rem;
  font-weight: bold;
}

.error-cont {
  color: #fff0f0;
  background: #b30000;
  padding: 1rem 2rem;
  border-radius: 10px;
  margin-top: 2rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
</style>