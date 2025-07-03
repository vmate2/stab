<template>
  <div class="background">
    <div class="wheel-container">
      <div class="wheel-wrapper">
        <!-- Arrow (fixed) -->
        <div class="arrow"></div>

        <!-- SVG spinning wheel -->
        <svg
          ref="wheel"
          viewBox="0 0 500 500"
          preserveAspectRatio="xMidYMid meet"
        >
          <g>
            <path
              v-for="(segment, index) in segments"
              :key="'seg' + index"
              :d="segment.path"
              :fill="segment.color"
              stroke="#000"
              stroke-width="1"
            />
          </g>

          <!-- Labels -->
          <g>
            <text
              v-for="(label, index) in segmentLabels"
              :key="'text' + index"
              :x="(center + textRadius * Math.cos((segmentAngle * index + segmentAngle / 2) * Math.PI / 180)).toFixed(3)"
              :y="(center + textRadius * Math.sin((segmentAngle * index + segmentAngle / 2) * Math.PI / 180)).toFixed(3)"
              fill="white"
              font-size="14"
              font-family="'Courier New', Courier, monospace"
              text-anchor="middle"
              alignment-baseline="middle"
              :transform="`rotate(${(segmentAngle * index + segmentAngle / 2).toFixed(3)}, ${(center + textRadius * Math.cos((segmentAngle * index + segmentAngle / 2) * Math.PI / 180)).toFixed(3)}, ${(center + textRadius * Math.sin((segmentAngle * index + segmentAngle / 2) * Math.PI / 180)).toFixed(3)})`"
            >
              {{ label }}
            </text>
          </g>
        </svg>
      </div>

      <p v-if="selectedIndex !== null" class="result">
        🎯 You got: <strong>{{ segmentLabels[selectedIndex] }}</strong>
      </p>
    </div>
  </div>

  <!-- Full-screen overlay for spin trigger -->
  <div class="overlay" @click="spin()"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const wheel = ref<SVGSVGElement | null>(null)
const segmentCount = 10
const center = 250
const radius = 250
const textRadius = 170
const segmentAngle = 360 / segmentCount
const colors = ['red', 'black', 'red', 'black', 'red', 'green', 'red', 'black', 'red', 'black']
const segmentLabels = [
  'Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5',
  'Prize 6', 'Prize 7', 'Prize 8', 'Prize 9', 'Prize 10'
]

const spinning = ref(false)
const selectedIndex = ref<number | null>(null)

type Segment = {
  path: string
  color: string
}

const segments = ref<Segment[]>([])

onMounted(() => {
  const segs: Segment[] = []

  for (let i = 0; i < segmentCount; i++) {
    const start = ((i * segmentAngle) * Math.PI / 180).toFixed(3)
    const end = (((i + 1) * segmentAngle) * Math.PI / 180).toFixed(3)

    const x1 =(center + radius * Math.cos(start)).toFixed(3)
    const y1 = (center + radius * Math.sin(start)).toFixed(3)
    const x2 = (center + radius * Math.cos(end)).toFixed(3)
    const y2 = (center + radius * Math.sin(end)).toFixed(3)

    const largeArc = segmentAngle > 180 ? 1 : 0

    const path = `
      M ${center} ${center}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `.trim()

    segs.push({ path, color: colors[i % colors.length] })
  }

  segments.value = segs
})

let rotation = ref(0)

function spin() {
  if (spinning.value) return
  spinning.value = true

  const extra = Math.floor(Math.random() * 360)
  const spins = Math.floor(Math.random() * 5) + 5
  rotation.value += spins * 360 + extra

  selectedIndex.value = null

  if (wheel.value) {
    wheel.value.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)'
    wheel.value.style.transform = `rotate(${rotation.value}deg)`

setTimeout(() => {
  const finalDeg = rotation.value % 360

  // Adjust so 0° is at the top (arrow position)
  const adjustedDeg = (360 - finalDeg + 270) % 360

  // Calculate raw index and angle within that segment
  const segmentFloatIndex = adjustedDeg / segmentAngle
  let index = Math.floor(segmentFloatIndex)
  const withinSegmentAngle = segmentFloatIndex - index

  // If the arrow is in the last 1/4th of the segment, go to the previous one
  //if (withinSegmentAngle >= 0.75) {
  //  index = (index - 1 + segmentCount) % segmentCount
  //}

  selectedIndex.value = index
  spinning.value = false

  console.log('🎯 Winner:', segmentLabels[index])
}, 4000)
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'casino';
  src: url('public/fonts/CasinoShadow.ttf') format('woff2'),
       url('public/fonts/CasinoShadow.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  cursor: pointer;
}

.background {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  backdrop-filter: blur(5px);
  background: rgba(100, 0, 0, 0.5);
  position: fixed;
}

.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wheel-wrapper {
  position: relative;
  width: min(60vw, 60vh);
  height: min(60vw, 60vh);
  border-radius: 50%;
  border: 5px solid #1a1a1a;
  overflow: hidden;
  display: flex;
  box-shadow: #1a1a1a 0 0 15px;
}

svg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center;
}

.arrow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 1.5vw solid transparent;
  border-right: 1.5vw solid transparent;
  border-top: 2.5vw solid gold;
  z-index: 10;
}

.result {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 500;
  color: white;
  font-family:'Courier New', Courier, monospace;
}
</style>
