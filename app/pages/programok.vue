<template>
  <div class="dayTracker">{{ currentDay + 'i programtáblázat' }}</div>
  <div class="timetable-container" @click="handleOutsideClick">
    <div class="timetable">
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
            :style="getProgramStyle(program.start, program.end)"
            @click="openProgram(program)"
          >
            <div class="program-title">{{ program.name }}</div>
            <div class="program-details">
              <div class="program-time">{{ program.start }}-{{ program.end }}</div>
              <div class="program-location">{{ program.location }}</div>
            </div>
          </div>
        </div>
        <div class="current-time-line" :style="currentTimeLineStyle" />
      </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ visible: showSidebar }">
      <button class="close-button" @click="closeSidebar">×</button>
      <div v-if="selectedProgram" class="sidebar-content">
        <h2>{{ selectedProgram.name }}</h2>
        <p><strong>Idő:</strong> {{ selectedProgram.start }} - {{ selectedProgram.end }}</p>
        <p><strong>Helyszín:</strong> {{ selectedProgram.location }}</p>
        <p v-if="selectedProgram.description"><strong>Leírás:</strong> {{ selectedProgram.description }}</p>
      </div>
    </div>
  </div>
</template>



<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

setPageLayout('main')


interface Program {
  name: string
  start: string
  end: string
  location: string
  description?: string
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


const getDay = () => {
  const days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']
  return days[new Date().getDay()]
}

const currentDay = ref(getDay())


const timetableStartHour = 7
const timetableEndHour = 24
const totalMinutes = (timetableEndHour - timetableStartHour) * 60

const hours = Array.from({ length: timetableEndHour - timetableStartHour }, (_, i) => i + timetableStartHour)

const rawPrograms = ref<Program[]>([
  { name: 'Megnyitó', start: '08:00', end: '09:00', location: 'Aula', description: 'Ünnepélyes megnyitó beszédek.' },
  { name: 'Robotika', start: '08:30', end: '10:00', location: '101-es terem', description: 'Robotépítés workshop' },
  { name: 'Kvíz', start: '09:00', end: '11:30', location: '202-es terem', description: 'Általános műveltségi kvíz csapatoknak' },
  { name: 'Koncert', start: '20:00', end: '22:30', location: 'Színpad', description: 'Esti koncert a tornateremben' },
  { name: 'Tánc', start: '21:00', end: '23:00', location: 'Színházterem' },
  { name: 'Tánc2', start: '21:00', end: '23:00', location: 'Aula' },
  { name: 'Progi', start: '08:10', end: '10:00', location: '104-es terem' },
  { name: 'Progik', start: '11:47', end: '13:00', location: '1204-es terem' },
])



const {data: programData} = await useFetch('/api/getProgramsPublic',{
    method: 'get'
})

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
  return parseTime(program.start) <= nowMinutes && nowMinutes < parseTime(program.end)
}

const columns = ref<Program[][]>([])

function parseTime(str: string): number {
  const [h, m] = str.split(':').map(Number)
  return h * 60 + m
}

// Szétosztja a programokat nem átfedő oszlopokba
function distributePrograms() {
  const sorted = [...rawPrograms.value].sort((a, b) => parseTime(a.start) - parseTime(b.start))
  const cols: Program[][] = []

  sorted.forEach(program => {
    let placed = false
    for (const col of cols) {
      const last = col[col.length - 1]
      if (parseTime(program.start) >= parseTime(last.end)) {
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
function getProgramStyle(start: string, end: string) {
  const top = parseTime(start) - timetableStartHour * 60
  const height = parseTime(end) - parseTime(start)
  return {
    top: `${top}px`,
    height: `${height - 2}px`,
  }
}

const currentTimeLineStyle = ref({ top: '0px' })

function updateCurrentTimeLine() {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const clamped = Math.max(timetableStartHour * 60, Math.min(currentMinutes, timetableEndHour * 60))
  currentTimeLineStyle.value.top = `${clamped - timetableStartHour * 60}px`
}

onMounted(() => {
  distributePrograms()
  updateCurrentTimeLine()
  const interval = setInterval(updateCurrentTimeLine, 60000)
  onUnmounted(() => clearInterval(interval))
})

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
  height: 59px; /* 1 óra = 60px */
  font-size: 0.8rem;
  border-bottom: 1px dashed #440000;
  display: flex;
  color: #ffcccc;
  align-items: flex-start;
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
  font-size: 0.85rem;
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
}

.dayTracker {
  position: relative;
  top: 0;
  background: #330000;
  color: #ffd700;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 3rem;
  border-bottom: 2px solid #990000;
  text-align: center;
}
</style>
