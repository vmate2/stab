<template>
  <div
    class="background"
    :class="props.disappear ? 'disappear' : ''"
    :style="props.disappear ? { background: 'none' } : {}"
  >
    <div class="luckySpinTXT">LUCKY SPIN</div>
    <div class="wheel-container">
      <div class="wheel-wrapper">
        <!-- Podium spotlights background -->
        <svg class="spotlights" viewBox="0 0 500 500" style="position:absolute;z-index:0;pointer-events:none;">
          <defs>
            <radialGradient id="spotlight-fade" cx="50%" cy="100%" r="100%">
              <stop offset="0%" stop-color="#fffbe0" stop-opacity="0.7"/>
              <stop offset="60%" stop-color="#fffbe0" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#fffbe0" stop-opacity="0"/>
            </radialGradient>
            <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>
          <!-- Left spotlight -->
          <polygon points="60,0 180,250 320,250" fill="url(#spotlight-fade)" filter="url(#blur)" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.5;0.7" dur="3s" repeatCount="indefinite"/>
          </polygon>
          <!-- Center spotlight -->
          <polygon points="250,0 180,250 320,250" fill="url(#spotlight-fade)" filter="url(#blur)" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.6;0.8" dur="2.5s" repeatCount="indefinite"/>
          </polygon>
          <!-- Right spotlight -->
          <polygon points="440,0 180,250 320,250" fill="url(#spotlight-fade)" filter="url(#blur)" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.5;0.7" dur="3.2s" repeatCount="indefinite"/>
          </polygon>
        </svg>
        <!-- Light rays background -->
        <svg class="light-rays" viewBox="0 0 500 500" style="position:absolute;z-index:0;pointer-events:none;">
          <g>
            <g v-for="n in 24" :key="n">
              <rect
                :x="248"
                :y="30"
                width="4"
                height="70"
                :fill="`rgba(255, 215, 0, 0.13)`"
                :transform="`rotate(${n * 15}, 250, 250)`"
                rx="2"
              />
            </g>
          </g>
        </svg>
        <!-- Arrow (fixed, animated) -->
        <div class="arrow" :class="{ bounce: arrowBounce }"></div>

        <!-- SVG spinning wheel -->
        <svg
          ref="wheel"
          viewBox="0 0 500 500"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fffbe0" stop-opacity="1"/>
              <stop offset="80%" stop-color="#FFD700" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#FFD700" stop-opacity="0.2"/>
            </radialGradient>
            <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ff4d4d"/>
              <stop offset="100%" stop-color="#b30000"/>
            </linearGradient>
            <linearGradient id="blackGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#444"/>
              <stop offset="100%" stop-color="#000"/>
            </linearGradient>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#00ff99"/>
              <stop offset="100%" stop-color="#007a3d"/>
            </linearGradient>
          </defs>
          <g>
            <path
              v-for="(segment, index) in segments"
              :key="'seg' + index"
              :d="segment.path"
              :fill="segment.gradient"
              stroke="#FFD700"
              stroke-width="4"
              filter="url(#shadow)"
              :class="{ highlight: selectedIndex === index && highlightWin }"
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
          <!-- Centerpiece -->
          <circle :cx="center" :cy="center" r="60" fill="url(#centerGlow)" class="centerpiece"/>
          <circle :cx="center" :cy="center" r="40" fill="#FFD700" stroke="#fff" stroke-width="4"/>
          <text :x="center" :y="center+8" text-anchor="middle" font-size="32" font-family="'casino', sans-serif" fill="#1a1a1a" style="font-weight:bold;">★</text>
        </svg>
      </div>


    </div>
    <div class="SPIN">SPIN</div>
  </div>

  <!-- Full-screen overlay for spin trigger -->
  <div class="overlay" @click="spin()"></div>
  <Dialog />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dialog from '~/plugins/dialog';
import confetti from 'canvas-confetti'

const spinSound = new Audio('/sounds/spin.mp3')
const winSound = new Audio('/sounds/win.mp3')
const chipWinSound = new Audio('/sounds/chip_win.mp3')

spinSound.preload = 'auto'
spinSound.volume = 0.4

winSound.preload = 'auto'
winSound.volume = 0.6
chipWinSound.preload = 'auto'
chipWinSound.volume = 0.6

const props = defineProps({
  disappear: {
    type: Boolean,
    default: false
  }
})


const { $notify } = useNuxtApp();
const { $showDialog } = useNuxtApp();

const emit = defineEmits(['dontShow', 'win'])


const wheel = ref<SVGSVGElement | null>(null)
const segmentCount = 10
const center = 250
const radius = 250
const textRadius = 170
const segmentAngle = 360 / segmentCount
const colors = ['red', 'black', 'red', 'black', 'red', 'green', 'red', 'black', 'red', 'black']
const segmentLabels = [
  'Pörgess újra...', 'Fagylalt kupon', '1000 Chip', '500 Chip', 'Kulcstartó',
  '5000 Chip', '200 Chip', 'Pörgess újra...', 'XIXO tea (330ml)', 'Sajnos nem nyert!'
]


const spinning = ref(false)
const selectedIndex = ref<number | null>(null)
const arrowBounce = ref(false)
const highlightWin = ref(false)

type Segment = {
  path: string
  color: string
  gradient: string
}

const segments = ref<Segment[]>([])

onMounted(() => {
  const segs: Segment[] = []

  for (let i = 0; i < segmentCount; i++) {
    const start: any = ((i * segmentAngle) * Math.PI / 180).toFixed(3)
    const end: any = (((i + 1) * segmentAngle) * Math.PI / 180).toFixed(3)

    const x1 = (center + radius * Math.cos(start)).toFixed(3)
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

    // Assign gradient based on color
    let gradient = 'url(#redGrad)'
    if (colors[i % colors.length] === 'black') gradient = 'url(#blackGrad)'
    if (colors[i % colors.length] === 'green') gradient = 'url(#greenGrad)'

    segs.push({ path, color: colors[i % colors.length] || 'red', gradient })
  }

  segments.value = segs
})

let rotation = ref(0)

function spin() {
  if (spinning.value) return
  spinning.value = true

  spinSound.currentTime = 0
  spinSound.play()

  const extra = Math.floor(Math.random() * 360)
  const spins = Math.floor(Math.random() * 5) + 5
  rotation.value += spins * 360 + extra

  selectedIndex.value = null
  highlightWin.value = false

  if (wheel.value) {
    wheel.value.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)'
    wheel.value.style.transform = `rotate(${rotation.value}deg)`

    setTimeout(() => {
      const finalDeg = rotation.value % 360
      // Adjust so 0° is at the top (arrow position)
      const adjustedDeg = (360 - finalDeg + 270) % 360
      const segmentFloatIndex = adjustedDeg / segmentAngle
      let index = Math.floor(segmentFloatIndex)
      selectedIndex.value = index
      spinning.value = false

      // Animate arrow bounce
      arrowBounce.value = true
      setTimeout(() => { arrowBounce.value = false }, 700)
      // Highlight winning segment
      highlightWin.value = true
      setTimeout(() => { highlightWin.value = false }, 1800)

      console.log('🎯 Winner:', segmentLabels[index], index)
      if (index === 0 || index === 7) {
        console.log('triggered');
        
        const dialogData = {
          show: true,
          title: 'Pörgess újra...',
          desc: 'Sajnos nem nyertél, de pörgethetsz újra!',
          inputs: [],
          buttons: [
            { label: 'Pörgetés', value: 'spin', color: '#4CAF50', textcolor: '#FFFFFF' }
          ]
        }
        $showDialog(dialogData).then((result: any) => {
          if (result.button === 'spin') {
            spin() // Trigger another spin
          }
        })
        
      } else if (index === 1) {
        confetti({
          particleCount: 300,
          spread: 90,
          origin: { y: 0.5, x: 0.5 },
        })
        winSound.currentTime = 0;
        winSound.play();
        const dialogData = {
          show: true,
          title: 'Fagylalt kupon nyertél!',
          desc: 'Gratulálunk! Nyertél egy fagylalt kupont az Adria Fagylaltozóba! \n Írd be a neved és e-mail címed, hogy elküldhessük a kupont.',
          inputs: [
            { label: 'Név', type: 'text', value: '', placeholder: 'Írd be a neved' },
            { label: 'E-mail', type: 'text', value: '', placeholder: 'Írd be az e-mail címed' }
          ],
          buttons: [
            { label: 'Küldés', value: 'submit', color: '#4CAF50', textcolor: '#FFFFFF', required: true, type: 'submit' },
            { label: 'Mégse', value: 'cancel', color: '#F44336', textcolor: '#FFFFFF', required: true }
          ]
        }
        handleDialogWithValidation(dialogData, (name, email) => {
          emit('win', { type: 'fagylalt_kupon', name, email });
        })
      } else if (index === 4) {
            confetti({
              particleCount: 200,
              spread: 70,
              origin: { y: 0.3 },
            })
            winSound.currentTime = 0;
            winSound.play();
            const dialogData = {
              show: true,
              title: 'Fagylalt kupon nyertél!',
              desc: 'Gratulálunk! Nyertél egy kulcstartót! \n Írd be a neved és e-mail címed, hogy elküldhessük a nyereményed QR kódját.',
              inputs: [
                { label: 'Név', type: 'text', value: '', placeholder: 'Írd be a neved' },
                { label: 'E-mail', type: 'text', value: '', placeholder: 'Írd be az e-mail címed' }
              ],
              buttons: [
                { label: 'Küldés', value: 'submit', color: '#4CAF50', textcolor: '#FFFFFF', required: true , type: 'submit'},
                { label: 'Mégse', value: 'cancel', color: '#F44336', textcolor: '#FFFFFF', required: true }
              ]
            }
        handleDialogWithValidation(dialogData, (name, email) => {
          emit('win', { type: 'kulcstarto', name, email });
        })
      } else if (index === 5 || index === 2 || index === 3 || index === 6) {
            confetti({
              particleCount: 300,
              spread: 90,
              origin: { y: 0.5, x: 0.5 },
            })
              winSound.currentTime = 0
              winSound.play()
              chipWinSound.currentTime = 0
              chipWinSound.play()
            const dialogData = {
              show: true,
              title: 'Chip-et nyertél!',
              desc: `Gratulálunk! Nyertél ${segmentLabels[index]}-et! \n Írd be a neved és e-mail címed, hogy elküldhessük a nyereményed QR kódját.`,
              inputs: [
                { label: 'Név', type: 'text', value: '', placeholder: 'Írd be a neved', required: true },
                { label: 'E-mail', type: 'text', value: '', placeholder: 'Írd be az e-mail címed', required: true }
              ],
              buttons: [
                { label: 'Küldés', value: 'submit', color: '#4CAF50', textcolor: '#FFFFFF', type: 'submit' },
                { label: 'Mégse', value: 'cancel', color: '#F44336', textcolor: '#FFFFFF' }
              ]
            }
        handleDialogWithValidation(dialogData, (name, email) => {
          emit('win', { type: 'chip', amount: segmentLabels[index]?.slice(0, -4).trim(), name, email });
        })
      } else if (index === 8) {
        confetti({
          particleCount: 300,
          spread: 90,
          origin: { y: 0.5, x: 0.5 },
        })
        winSound.currentTime = 0
        winSound.play()
        const dialogData = {
          show: true,
          title: 'XIXO tea nyertél!',
          desc: 'Gratulálunk! Nyertél egy XIXO teát! \n Írd be a neved és e-mail címed, hogy elküldhessük a nyereményed QR kódját.',
          inputs: [
            { label: 'Név', type: 'text', value: '', placeholder: 'Írd be a neved', required: true},
            { label: 'E-mail', type: 'text', value: '', placeholder: 'Írd be az e-mail címed', required: true}
          ],
          buttons: [
            { label: 'Küldés', value: 'submit', color: '#4CAF50', textcolor: '#FFFFFF', type: 'submit' },
            { label: 'Mégse', value: 'cancel', color: '#F44336', textcolor: '#FFFFFF' }
          ]
        }
        handleDialogWithValidation(dialogData, (name, email) => {
          emit('win', { type: 'xixo_tea', name, email });
        })
      } else if (index === 9) {
        const dialogData = {
          show: true,
          title: 'Sajnos nem nyertél!',
          desc: 'Sajnáljuk, de ezúttal nem nyertél semmit. Próbáld meg újra később!',
          buttons: [
            { label: 'Rendben', value: 'ok', color: '#4CAF50', textcolor: '#FFFFFF' }
          ]
        }
        $showDialog(dialogData).then((result: any) => {
          if (result.button === 'ok') {
            emit('dontShow');
          }
        })
      }
    }, 4000)
  }
}

function handleDialogWithValidation(dialogData: any, onValid: (name: string, email: string) => void) {
  $showDialog(dialogData).then((result: any) => {
    if (result.button === 'cancel') {
      emit('dontShow');
      return;
    }
    const name = result.inputs[0].value;
    const email = result.inputs[1].value;
    if (!validateName(name) || !validateEmail(email)) {
      $notify('Kérlek, adj meg egy érvényes nevet és e-mail címet!', 'error');
      handleDialogWithValidation(dialogData, onValid); // Recursively redisplay and revalidate
      return;
    }
    onValid(name, email);
    emit('dontShow');
  });
}

function validateName(name: string): boolean {
  // Hungarian name: at least 2 words, each can start with any letter, can contain accented chars
  return /^([A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+\s){1,}[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(name.trim());
}
function validateEmail(email: string): boolean {
  // Allow .com and any valid TLD (2-24 chars)
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}$/.test(email.trim());
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
  flex-direction: column;
  transition: all 0.3s ease-in-out;
}

.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media screen and (max-width: 843px) {
  .wheel-wrapper {
    width: min(85vw, 85vh) !important;
    height: min(85vw, 85vh) !important;
  }
  
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
  opacity: 0.7;
  transition: transform 0.2s cubic-bezier(.4,2,.6,1);
}
.arrow.bounce {
  animation: arrow-bounce 0.7s cubic-bezier(.4,2,.6,1);
}
@keyframes arrow-bounce {
  0% { transform: translateX(-50%) scaleY(1); }
  30% { transform: translateX(-50%) scaleY(1.3); }
  60% { transform: translateX(-50%) scaleY(0.8); }
  100% { transform: translateX(-50%) scaleY(1); }
}

.result {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 500;
  color: white;
  font-family:'Courier New', Courier, monospace;
}

.luckySpinTXT {
  font-family: 'casino', sans-serif;
  font-size: 4rem;
  color: #FFD700;
  text-shadow: 2px 2px #1a1a1a;
  margin-bottom: 20px;
  border-radius: 18px;
  filter: drop-shadow(0 0 30px #FFD700) drop-shadow(0 0 60px #FFD700);
}

.SPIN {
  font-family: 'casino', sans-serif;
  font-size: 2rem;
  color: #fff;
  margin-top: 20px;
  background: linear-gradient(180deg, #00ff00 0%, #009900 100%);
  padding: 14px 32px;
  border-radius: 16px;
  box-shadow:
    0 6px 0 #066406,
    0 10px 20px rgba(0,0,0,0.4),
    0 1.5px 0 #fff inset;
  scale: 1.2;
  position: relative;
  transition: transform 0.1s;
  letter-spacing: 3px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
  
}

.disappear {
  animation: disappear 2s forwards;
}

@keyframes disappear {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.1);
  }
}

.centerpiece {
  filter: drop-shadow(0 0 16px #FFD700) drop-shadow(0 0 32px #FFD700);
  animation: center-glow 2s infinite alternate;
}
@keyframes center-glow {
  0% { filter: drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 16px #FFD700); }
  100% { filter: drop-shadow(0 0 32px #FFD700) drop-shadow(0 0 64px #FFD700); }
}

path.highlight {
  filter: drop-shadow(0 0 16px #fffbe0) drop-shadow(0 0 32px #FFD700);
  opacity: 0.95;
}

.spotlights {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
