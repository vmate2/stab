<template>
  <div class="dayTracker" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <button class="dayArrow left" @click="prevDay">‹</button>

    <transition :name="swipeDirection === 'left' ? 'day-swipe-left' : 'day-swipe-right'" mode="out-in">
      <div :key="currentDay" class="dayTitle">
        {{ currentDay }} <span v-if="daySuffix">({{ daySuffix }})</span>
      </div>
    </transition>

    <button class="dayArrow right" @click="nextDay">›</button>
  </div>
  <div 
    class="timetable-container" 
    :class="{ 'no-click': showSidebar }"
    @click="handleOutsideClick"
  >
    <div class="timetable" :style="timetableStyle">
      <div class="timetable-time-column">
        <div v-for="hour in hours" :key="hour" class="timetable-hour">
          {{ hour }}:00
        </div>
      </div>

      <div class="timetable-program-columns">
        <div v-for="(column, colIndex) in columns" :key="colIndex" class="timetable-program-column">
          <div
            v-for="(program, index) in column"
            :key="index"
            class="program-block"
            :class="{ 'active-program': isRunning(program) }"
            :style="getProgramStyle(program.startTime, program.duration)"
            @click="openProgram(program)"
          >
            <div class="program-title">{{ program.title }}</div>
            <div class="program-details">
              <div class="program-time">{{ program.startTime }}-{{ addDuration(program.startTime, program.duration) }}</div>
              <div class="program-location">{{ program.location }}</div>
            </div>
          </div>
        </div>
        <div class="current-time-line" :style="currentTimeLineStyle" />
      </div>
    </div>

    <!-- Sidebar -->
  <div class="sidebar"
       :class="{ visible: showSidebar }"
       @touchstart.stop="handleSidebarTouchStart"
       @touchend.stop="handleSidebarTouchEnd">
      <button class="close-button" @click="closeSidebar">×</button>
      <div v-if="selectedProgram" class="sidebar-content">
        <h2>{{ selectedProgram.title }}</h2>
        <p><strong>Idő:</strong> {{ selectedProgram.startTime }} - {{ addDuration(selectedProgram.startTime, selectedProgram.duration) }}</p>
        <p><strong>Helyszín:</strong> {{ selectedProgram.location }}</p>
        <p v-if="selectedProgram.description"><strong>Leírás:</strong> {{ selectedProgram.description }}</p>
      </div>
    </div>
  </div>
</template>



<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

definePageMeta({
    layout: 'main'
})


interface Program {
  title: string
  startTime: string
  duration: string
  location: string
  description?: string
  day?: string
}


function handleOutsideClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (
    showSidebar.value &&
    !target.closest('.program-block') &&
    !target.closest('.sidebar')
  ) {
    closeSidebar()
  }
}

const swipeDirection = ref<'left' | 'right'>('left')
const daysList = ['LIKE','Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök']
const currentIndex = ref(0)
const currentDay = computed(() => daysList[currentIndex.value])
const daySuffix = computed(() => {
  const i = currentIndex.value
  return i >= 0 && i <= 5 ? `${i}.nap` : ''
})

function prevDay() {
  if (currentIndex.value > 0) {
    swipeDirection.value = 'right' // jobbra animáció
    currentIndex.value -= 1
    distributePrograms()
  }
}

function nextDay() {
  if (currentIndex.value < daysList.length - 1) {
    swipeDirection.value = 'left' // balra animáció
    currentIndex.value += 1
    distributePrograms()
  }
}


const timetableStartHour = 7
const timetableEndHour = 24
const totalMinutes = (timetableEndHour - timetableStartHour) * 60

const hours = Array.from({ length: timetableEndHour - timetableStartHour }, (_, i) => i + timetableStartHour)

const rawPrograms = ref<Program[]>([
])

// minute->px mapping used by programeditor
function minuteToPx(minutes: number) {
  return minutes * (14.75 / 15) // ~0.9833 px/min
}

const timetableStyle = computed(() => ({ minHeight: `${minuteToPx(totalMinutes)}px` }))



const {data: programData} = await useFetch('/api/programok',{
  method: 'get'
})

// Re-run distribution when API data arrives or when day changes
watch(programData, () => distributePrograms())
watch(currentIndex, () => distributePrograms())

const selectedProgram = ref<Program | null>(null)
const showSidebar = ref(false)

function openProgram(program: Program) {
  selectedProgram.value = program
  showSidebar.value = true
}

function closeSidebar() {
  showSidebar.value = false
}

function isRunning(program: Program): boolean {
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const startM = parseTime(program.startTime)
  const endM = parseTime(addDuration(program.startTime, program.duration))
  return startM <= nowMinutes && nowMinutes < endM
}

const columns = ref<Program[][]>([])

function parseTime(str: string): number {
  if (!str) return 0
  const parts = String(str).split(':').map(Number)
  const h = parts[0] ?? 0
  const m = parts[1] ?? 0
  return h * 60 + m
}

function addMinutesToTime(start: string, mins: number) {
  const total = parseTime(start) + mins
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function durationToMinutes(duration: any) {
  if (duration === undefined || duration === null) return 0
  if (typeof duration === 'number') return Math.max(0, Math.floor(duration))
  const s = String(duration).trim()
  if (/^\d+$/.test(s)) return Number(s)
  if (/^\d{1,2}:\d{2}$/.test(s)) {
    const [h, m] = s.split(':').map(Number)
    return (h || 0) * 60 + (m || 0)
  }
  return 0
}

function addDuration(start: string, duration: string | number) {
  const dur = durationToMinutes(duration)
  return addMinutesToTime(start, dur)
}

// Szétosztja a programokat nem átfedő oszlopokba
function distributePrograms() {
  // prefer API data when available, fall back to local rawPrograms
  const source = (programData && programData.value && Array.isArray(programData.value)) ? programData.value : rawPrograms.value
  const selectedDay = daysList[currentIndex.value]

  // normalize source: if a program has `duration` (minutes), compute its `end` time string
  // helper: find time-like strings anywhere in the object
  const timeRegex = /\b([01]?\d|2[0-3]):[0-5]\d\b/
  function findTimesInObj(obj: any) {
    const found: string[] = []
    for (const k of Object.keys(obj)) {
      const v = obj[k]
      if (typeof v === 'string') {
        const m = v.match(timeRegex)
        if (m) found.push(m[0])
        // also handle ranges like '08:00-10:00'
        const range = v.match(/([01]?\d|2[0-3]:[0-5]\d)\s*-\s*([01]?\d|2[0-3]:[0-5]\d)/)
        if (range) {
          if (typeof range[1] === 'string') found.push(range[1])
          if (typeof range[2] === 'string') found.push(range[2])
        }
      }
    }
    return found
  }

  const normalized = (source as any[]).map(p => {
    const title = p.title || p.name || p.event || p.program || ''
    const location = p.location || p.room || p.place || p.helyszin || p.venue || ''
    const desc = p.description || p.desc || p.leiras || ''

    const start = p.startTime || p.start || p.starts_at || p.time || '00:00'
    let duration: any = null
    if (p.duration !== undefined && p.duration !== null) duration = p.duration
    else if (p.end || p.ends_at) {
      const endStr = p.end || p.ends_at
      const durMins = Math.max(0, parseTime(endStr) - parseTime(start))
      duration = `${String(Math.floor(durMins / 60)).padStart(2,'0')}:${String(durMins % 60).padStart(2,'0')}`
    } else {
      const times = findTimesInObj(p)
      if (times.length >= 2 && times[0] && times[1]) {
        const durMins = Math.max(0, parseTime(times[1]) - parseTime(times[0]))
        duration = `${String(Math.floor(durMins / 60)).padStart(2,'0')}:${String(durMins % 60).padStart(2,'0')}`
      }
    }

    return {
      title,
      startTime: start,
      duration: duration || '00:00',
      location,
      description: desc,
      day: p.day,
    }
  })

  const filtered = normalized.filter((p: any) => {
    if (!p.day) return selectedDay === 'LIKE'
    return p.day === selectedDay
  })

  const sorted = [...filtered].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime))
  const cols: Program[][] = []

  sorted.forEach(program => {
    let placed = false
    for (const col of cols) {
      const last = col[col.length - 1]
      if (!last) continue
      if (parseTime(program.startTime) >= parseTime(addDuration(last.startTime, last.duration))) {
        col.push(program)
        placed = true
        break
      }
    }
    if (!placed) cols.push([program])
  })

  columns.value = cols
}

// Programok pozíciója (függőleges helyzet és magasság)
function getProgramStyle(startTime: string, duration: string | number) {
  const startMinutes = parseTime(startTime)
  const endTime = addDuration(startTime, duration)
  const endMinutes = parseTime(endTime)
  const topMinutes = startMinutes - timetableStartHour * 60
  const heightMinutes = Math.max(0, endMinutes - startMinutes)
  return {
    top: `${minuteToPx(topMinutes)}px`,
    height: `${minuteToPx(heightMinutes) - 2}px`,
  }
}

const currentTimeLineStyle = ref({ top: '0px' })

function updateCurrentTimeLine() {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const clamped = Math.max(timetableStartHour * 60, Math.min(currentMinutes, timetableEndHour * 60))
  currentTimeLineStyle.value.top = `${minuteToPx(clamped - timetableStartHour * 60)}px`
}

onMounted(() => {
  const today = new Date();
  const month = today.getMonth() + 1; // 0-index miatt
  const day = today.getDate();

  if (month === 9 && day === 28) currentIndex.value = 1; // Vasárnap 1.nap
  else if (month === 9 && day === 29) currentIndex.value = 2; // Hétfő 2.nap
  else if (month === 9 && day === 30) currentIndex.value = 3; // Kedd 3.nap
  else if (month === 10 && day === 1) currentIndex.value = 4; // Szerda 4.nap
  else if (month === 10 && day === 2) currentIndex.value = 5; // Csütörtök 5.nap
  else currentIndex.value = 0; // LIKE

  distributePrograms();
  updateCurrentTimeLine();
  const interval = setInterval(updateCurrentTimeLine, 60000);
  onUnmounted(() => clearInterval(interval));
});


const touchStartX = ref(0)
const touchEndX = ref(0)

function handleTouchStart(e: TouchEvent) {
  touchStartX.value = e.changedTouches[0].screenX
}

function handleTouchEnd(e: TouchEvent) {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}

function handleSwipe() {
  const deltaX = touchEndX.value - touchStartX.value
  if (Math.abs(deltaX) > 50) { 
    if (deltaX > 0) prevDay()
    else nextDay()
  }
}

const sidebarTouchStartX = ref(0)
const sidebarTouchEndX = ref(0)

function handleSidebarTouchStart(e: TouchEvent) {
  sidebarTouchStartX.value = e.changedTouches[0].screenX
}

function handleSidebarTouchEnd(e: TouchEvent) {
  sidebarTouchEndX.value = e.changedTouches[0].screenX
  handleSidebarSwipe()
}

function handleSidebarSwipe() {
  const deltaX = sidebarTouchEndX.value - sidebarTouchStartX.value
  if (deltaX > 50) { // jobbra húzás
    closeSidebar()  
  }
}

</script>

<style scoped>
.timetable-container {
  padding: 1rem;
  width: 90%;
  margin: auto;
  height: auto; /* 16 óra * 60px */
  background: #1a0000;
  border: 2px solid #990000;
  border-radius: 16px;
  box-shadow: 0 0 30px rgba(255, 0, 0, 0.4);
}

.timetable {
  display: flex;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.timetable-time-column {
  width: 70px;
  background: #2d0000;
  border-right: 2px solid #660000;
  padding-top: 2px;
}


.timetable-hour {
  height: 58px; /* 1 óra = 60px */
  font-size: 0.8rem;
  border-bottom: 1px dashed #440000;
  display: flex;
  color: #ffcccc;
  align-items: center; /* center vertically so label aligns with program rows */
  justify-content: center;
  overflow: hidden;
}


.timetable-program-columns {
  flex: 1;
  display: flex;
  position: relative;
}


.timetable-program-column {
  flex: 1;
  position: relative;
  border-left: 1px solid #330000;
}
.program-block {
  position: absolute;
  left: 5%;
  width: 90%;
  background: linear-gradient(135deg, #a20000, #ff4040);
  color: #fff8f0;
  padding: 4px;
  border-radius: 6px;
  font-size: clamp(0.7rem, 1.2vw, 1rem); /* kisebb képernyőn kisebb */
  font-weight: bold;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  border: 1px solid gold;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}
.active-program {
  background: linear-gradient(135deg, #ffd700, #ff8c00); /* arany-narancs */
  color: #4b0000; /* mély bordó szöveg */
  border: 1px solid #fff;
  box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.8); /* aranyló fény */
  transition: all 0.3s ease;
} 

.active-program .program-title {
  font-weight: 900;
  font-size: 1rem;
  color: #4b0000;
  text-shadow: 0 1px 1px #fff2cc;
}

.active-program .program-details {
  color: rgba(75, 0, 0, 0.8); /* bordó árnyalat */
  font-weight: 600;
}

.current-time-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: red;
  z-index: 10;
  pointer-events: none;
}

.program-details {
    position: relative;
  bottom: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7); /* halványabb szín */

}

@media (max-width: 768px) {
  .program-details {
    display: none;
  }
  .timetable-container {
    width: 85%; /* keskenyebb, hogy ne lógjon le */
  }

  .dayTracker {
    font-size: 1.8rem; /* kisebb, hogy mobilon elférjen */
    padding: 0.5rem;
    margin-top: 60px;
  }
}

.program-time {
  text-align: left;
}

.program-location {
  text-align: right;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 100%;
  width: 0;
  height: 100%;
  overflow: hidden;
  background: #1a0000;
  color: #fff8f0;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.6);
  transition: width 0.3s ease, padding 0.3s ease;
  z-index: 1000;
  padding: 0;
  width: 320px;
  transition: all 0.3s ease;
  border-left: 2px solid #990000;
  backdrop-filter: blur(5px);
  pointer-events: auto;
}


.sidebar.visible {
  transform: translateX(-320px);
}

.sidebar-content {
  margin-top: 2rem;
  padding: 1rem;
  background: #2d0000;
  border-radius: 8px;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
}

.sidebar-content h2 {
  margin-bottom: 1rem;
  color: #ffb400;
}



.sidebar-content p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  line-height: 1.4;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  align-self: flex-start;
  width: 30px;
  
}

.dayTracker {
  position: relative;
  background: #330000;
  color: #ffd700;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: clamp(1.8rem, 2vw + 1rem, 3rem); /* automatikusan skálázódik */
  border-bottom: 2px solid #990000;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  touch-action: pan-y; /* engedi a horizontális swipe-ot */
  user-select: none;
}

.dayArrow {
  background: none;
  border: none;
  color: #ffd700;
  font-size: 2.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
  transition: color 0.3s;
}

.dayArrow:hover {
  color: #ffcc00;
}


.program-title {
  font-size: clamp(0.85rem, 1.5vw, 1rem);
}

.day-swipe-left-enter-from { transform: translateX(100%); opacity: 0; }
.day-swipe-left-leave-to { transform: translateX(-100%); opacity: 0; }

/* Jobbra animálás */
.day-swipe-right-enter-from { transform: translateX(-100%); opacity: 0; }
.day-swipe-right-leave-to { transform: translateX(100%); opacity: 0; }

.day-swipe-left-enter-active,
.day-swipe-left-leave-active,
.day-swipe-right-enter-active,
.day-swipe-right-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}


</style>
