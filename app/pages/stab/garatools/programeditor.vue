<template>
  <div class="mainCont">
      <div class="dayTracker">
          <button class="dayArrow left" @click="prevDay" aria-label="Előző nap">‹</button>
          <div class="dayTitle">{{ currentDay }}i <span v-if="daySuffix">({{ daySuffix }})</span> programtáblázat</div>
          <button class="dayArrow right" @click="nextDay" aria-label="Következő nap">›</button>
      </div>
  <div class="timetable-container" ref="timetableContainer" @click="handleOutsideClick">
  <div class="timetable" ref="timetableEl" :style="timetableStyle">
      <div class="timetable-time-column">
        <div v-for="hour in hours" :key="hour" class="timetable-hour">
          {{ hour }}:00
        </div>
      </div>

      <div class="timetable-program-columns" @pointerdown.prevent="onPointerDown">
        <!-- 15-minute grid rows to help visually select times -->
        <div class="timetable-grid" aria-hidden="true">
          <div v-for="i in Math.floor(totalMinutes / 15)" :key="i" class="grid-row" />
        </div>
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
            <div class="program-time">{{ program.startTime }} - {{ addDuration(program.startTime, program.duration) }}</div>
              <div class="program-location">{{ program.location }}</div>
            </div>
          </div>
        </div>
  <div class="current-time-line" :style="currentTimeLineStyle" />
  <!-- temporary selection block shown while dragging to create a program -->
  <div v-if="isDragging" class="temp-block" :style="tempBlockStyle"></div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ visible: showSidebar }">
      <button class="close-button" @click="closeSidebar">×</button>
      <div v-if="selectedProgram" class="sidebar-content">
        <template v-if="!isEditing">
          <h2 class="sidebar-title">{{ selectedProgram.title }}</h2>
          <p><strong>Idő:</strong> {{ selectedProgram.startTime }} - {{ addDuration(selectedProgram.startTime, selectedProgram.duration) }}</p>
          <p><strong>Helyszín:</strong> {{ selectedProgram.location || 'Nincs megadva' }}</p>
          <p v-if="selectedProgram.description"><strong>Leírás:</strong> {{ selectedProgram.description }}</p>
          <button class="edit-btn" @click.stop="isEditing = true">Szerkesztés</button>
        </template>
      
        <template v-else>
          <label>Cím</label>
          <input class="edit-input" v-model="selectedProgram.title" />
        
          <label>Kezdés</label>
          <input class="edit-input" v-model="selectedProgram.startTime" />
        
          <label>Időtartam</label>
          <input class="edit-input" v-model="selectedProgram.duration" />
        
          <label>Helyszín</label>
          <input class="edit-input" v-model="selectedProgram.location" />
        
          <label>Leírás</label>
          <textarea class="edit-textarea" v-model="selectedProgram.description" />


            <div class="multi-select-container">
              <!-- Dropdown -->
              <div class="dropdown-wrapper">
                <button @click="open = !open" class="dropdown-btn">
                  Válassz személyt...
                </button>
              
                <transition name="fade">
                  <div v-if="open" class="dropdown-menu">
                    <div 
                      v-for="name in availableNames" 
                      :key="name"
                      @click="selectName(name.name)"
                      class="dropdown-item"
                    >
                      {{ name.name }}
                    </div>
                  </div>
                </transition>
              </div>
            
              <!-- Selected tags -->
              <div class="selected-tags">
                <transition-group name="fade" tag="div" class="tag-list">
                  <div v-for="name in selectedProgram.beosztva" :key="name" class="tag">
                    <span>{{ name }}</span>
                    <button @click="removeName(name)" class="tag-remove">×</button>
                  </div>
                </transition-group>
              </div>
            </div>

        
          <div class="edit-buttons">
            <button class="save-btn" @click.stop="saveEdits">Mentés</button>
            <button class="cancel-btn" @click.stop="cancelEdits">Mégse</button>
            <button class="delete-btn" @click.stop="deleteProgram">Törlés</button>
          </div>
        </template>
      </div>
    </div>
  </div>
  </div>
</template>



<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
const isEditing = ref(false)
const {$notify} = useNuxtApp()
definePageMeta({
    layout: 'new'
})

const deleteProgram = async() => {

  const response = await $fetch('/api/programok', {
    method: 'DELETE',
    headers: {
      'authorization' : `Bearer ${useCookie('token').value}`
    },
    body: {
      id: selectedProgram.value.id
    }
  })

  if (response.success) {
    $notify('sikeres törlés', 'success')
  } else {
    $notify('Sikertelen törlés', 'error')
  }
  distributePrograms()

}

async function saveEdits() {
  if (!selectedProgram.value) return

  const res = await $fetch(`/api/programok`, {
    method: 'PATCH',
    headers: { authorization: `Bearer ${useCookie('token').value}` },
    body: selectedProgram.value
  })

  isEditing.value = false
  distributePrograms()

  if (res) {
    console.log(res);
    
    $notify('Sikeres mentés!', 'success')
  }
}

function cancelEdits() {
  isEditing.value = false
  // Optionally reload program data from API to discard changes
}



interface Program {
  id: number
  title: string
  startTime: string
  duration: string
  location?: string
  description?: string
  beosztva?: string[] // JSON array of assigned days
  day: string
}

function addDuration(start: string, duration: string) {
  const [h1, m1] = start.split(':').map(Number)
  const [h2, m2] = duration.split(':').map(Number)
  let endH = h1 + h2
  let endM = m1 + m2
  if (endM >= 60) {
    endH += Math.floor(endM / 60)
    endM = endM % 60
  }
  return `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`
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



const daysList = ['LIKE','Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök']
const currentIndex = ref(0) // 0 -> LIKE
const currentDay = computed(() => daysList[currentIndex.value])
const daySuffix = computed(() => {
  // LIKE = 0.nap, Vasárnap = 1.nap, Hétfő = 2.nap ... Csütörtök = 5.nap
  const i = currentIndex.value
  if (i >=0 && i <= 5) return `${i}.nap`
  return ''
})

function prevDay() {
  if (currentIndex.value > 0) currentIndex.value -= 1
  distributePrograms()
}

function nextDay() {
  if (currentIndex.value < daysList.length - 1) currentIndex.value += 1
  distributePrograms()
}


const timetableStartHour = 7
const timetableEndHour = 24
const totalMinutes = (timetableEndHour - timetableStartHour) * 60

const hours = Array.from({ length: timetableEndHour - timetableStartHour }, (_, i) => i + timetableStartHour)

const timetableStyle = computed(() => ({ minHeight: `${totalMinutes}px` }))

const rawPrograms = ref<Program[]>([])

const staffNames = ref<string[]>([])
const open = ref(false)
onMounted(async () => {
  const data = await $fetch('/api/programok', {
    headers: { authorization: `Bearer ${useCookie('token').value}` }
  })
  rawPrograms.value = (data || []).map((p: any, idx: number) => ({
    id: p.id ?? idx + 1, // Use existing id or fallback to index+1
    title: p.title,
    startTime: p.startTime,
    duration: p.duration,
    location: p.location ?? '',
    description: p.description ?? '',
    beosztva: p.beosztva ?? [],
    day: p.day
  }))
  console.log(data);
    const response = await $fetch('/api/stabtagok.names', {
      method: 'GET',
      headers: {
        'authorization' : `Bearer ${useCookie('token').value}`
      }
    })
    staffNames.value = response || []
    console.log(response);
    
  distributePrograms()
})

const availableNames = computed(() =>
  staffNames.value.filter(name => !selectedProgram.value.beosztva.includes(name.name))
)

function selectName(name: string) {
  selectedProgram.value.beosztva.push(name)
  open.value = false
}

function removeName(name: string) {
  selectedProgram.value.beosztva = selectedProgram.value.beosztva.filter(n => n !== name)
}

const selectedProgram = ref<Program | null>(null)
const showSidebar = ref(false)

// Drag-to-create selection state
const timetableContainer = ref<HTMLElement | null>(null)
const timetableEl = ref<HTMLElement | null>(null)
const programColumnsEl = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragStartMin = ref(0)
const dragCurrentMin = ref(0)
const tempBlockStyle = computed(() => {
  if (!isDragging.value) return { display: 'none' }

  const start = Math.min(dragStartMin.value, dragCurrentMin.value)
  const end   = Math.max(dragStartMin.value, dragCurrentMin.value)

  const snappedStart = Math.round(start / 15) * 15
  const snappedEnd   = Math.round(end / 15) * 15

  const topPx = minuteToPx(snappedStart - timetableStartHour * 60)
  const heightPx = minuteToPx(snappedEnd - snappedStart)

  return {  
    top: `${topPx}px`,
    height: `${heightPx}px` // removed -2
  }
})

// Convert a Y position inside timetable to minutes (rounded to 15-minute steps)
function yToMinutes(y: number) {
  const el = programColumnsEl.value
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const scrollTop = el.scrollTop
  const relative = y - rect.top + scrollTop
  const minsFromTop = relative / (14.75 / 15) // inverse of minuteToPx
  const totalMins = timetableStartHour * 60 + minsFromTop
  return Math.round(totalMins / 15) * 15
}

async function finishDrag() {
  isDragging.value = false
  const startMin = Math.min(dragStartMin.value, dragCurrentMin.value)
  const endMin   = Math.max(dragStartMin.value, dragCurrentMin.value)
  if (endMin <= startMin) return

  const nuxt = useNuxtApp()
  const res = await nuxt.$showDialog({
    title: 'Új program létrehozása',
    desc: `Idő: ${formatMinutes(startMin)} - ${formatMinutes(endMin)}`,
    inputs: [
      { label: 'Név', type: 'text', placeholder: 'Program neve', value: '' },
      { label: 'Helyszín', type: 'text', placeholder: 'Helyszín', value: '' },
      { label: 'Leírás', type: 'textarea', placeholder: 'Leírás', value: '' },
      { label: 'Nap', type: 'dropdown', dropdownopts: daysList.map(d => ({ value: d, default: d === currentDay.value })) }
    ],
    buttons: [ { label: 'Létrehoz', value: 'ok' }, { label: 'Mégse', value: 'cancel' } ]
  })

  if (res.button === 'ok') {
    const inputs = Object.fromEntries(res.inputs.map(i => [i.label, i.value])) as any
    const durationStr = formatMinutes(endMin - startMin)   // ✅ correct duration

    // add to UI state
    rawPrograms.value.push({
      id: Date.now(),
      title: inputs['Név'] || 'Új program',
      startTime: formatMinutes(startMin),
      duration: durationStr,                               // ✅ use computed duration
      location: inputs['Helyszín'] || '',
      description: inputs['Leírás'] || '',
      day: currentDay.value ?? 'LIKE',
    })

    // save to API
    await $fetch('/api/programok', {
      method: 'POST',
      headers: { authorization: `Bearer ${useCookie('token').value}` },
      body: {
        title: inputs['Név'],
        startTime: formatMinutes(startMin),
        duration: durationStr,                             // ✅ correct sign
        location: inputs['Helyszín'],
        description: inputs['Leírás'],                    // ✅ (fixes typo: was "desription")
        day: currentDay.value ?? 'LIKE'
      }
    })

    distributePrograms()
  }
}


function formatMinutes(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Pointer handlers
function onPointerDown(evt: PointerEvent) {
  if (!(evt.target as HTMLElement).closest('.program-block')) {
    isDragging.value = true
  dragStartMin.value = yToMinutes(evt.clientY)
  dragCurrentMin.value = dragStartMin.value
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  }
}

function onPointerMove(evt: PointerEvent) {
  if (!isDragging.value) return
  dragCurrentMin.value = yToMinutes(evt.clientY)
}

function onPointerUp() {
  if (!isDragging.value) return
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  finishDrag()
}

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
  const start = parseTime(program.startTime)
  const end = parseTime(addDuration(program.startTime, program.duration))
  return start <= nowMinutes && nowMinutes < end
}

const columns = ref<Program[][]>([])

function parseTime(str: string): number {
  if (!str) return 0
  const parts = str.split(':').map(Number)
  const h = parts[0] ?? 0
  const m = parts[1] ?? 0
  return h * 60 + m
}

// Szétosztja a programokat nem átfedő oszlopokba
function distributePrograms() {
  const selectedDay = daysList[currentIndex.value]
const filtered = rawPrograms.value.filter(p => p.day === selectedDay)
  const sorted = filtered.sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime))
  
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


function minuteToPx(minutes: number) {
  return minutes * (14.75 / 15); // ~0.9833 px/min
}


// Programok pozíciója (függőleges helyzet és magasság)
function getProgramStyle(start: string, duration: string) {
  const top = parseTime(start) - timetableStartHour * 60
  const height = parseTime(addDuration(start, duration)) - parseTime(start)
  return {
    top: `${minuteToPx(top)}px`,
    height: `${minuteToPx(height) - 2}px`
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
  // wire DOM refs
  timetableContainer.value = document.querySelector('.timetable-container') as HTMLElement
  timetableEl.value = document.querySelector('.timetable') as HTMLElement
  programColumnsEl.value = document.querySelector('.timetable-program-columns') as HTMLElement
  distributePrograms()
  updateCurrentTimeLine()
  const interval = setInterval(updateCurrentTimeLine, 60000)
  onUnmounted(() => clearInterval(interval))
})

</script>

<style scoped>

.timetable-container {
  padding: 1rem;
  width: min(1200px, 95%);
  margin: 1.5rem auto;
  /* Make the container scrollable while the inner timetable keeps minute→px scale */
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  background: linear-gradient(180deg, rgba(26,0,0,0.95), rgba(10,0,0,0.85));
  border: 1px solid rgba(153,0,0,0.9);
  border-radius: 12px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.6);
}

.timetable {
  display: flex;
  height: auto;
  position: relative;
  /* inner element keeps absolute-positioned program blocks; let container scroll */
  overflow: visible;
}

.timetable-time-column {
  width: 84px;
  background: #2d0000;
  border-right: 2px solid #660000;
  padding-top: 0; /* remove small offset so grid aligns */
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

/* ensure consistent sizing across timetable columns */
.timetable, .timetable-time-column, .timetable-program-columns {
  box-sizing: border-box;
}


.timetable-program-columns {
  flex: 1;
  display: flex;
  position: relative;
}

.timetable-grid {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}
.grid-row {
  height: 13.75px; /* 15 minutes = 15px */
  border-bottom: 1px dashed rgba(255,255,255,0.03);
}

.timetable-program-column {
  z-index: 5; /* make program blocks above the grid */
}


.timetable-program-column {
  flex: 1;
  position: relative;
  border-left: 1px solid #330000;
  min-width: 140px;
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

/* temporary selection block while dragging to create program */
.temp-block {
  position: absolute;
  left: 2%;
  width: 96%;
  background: rgba(255, 200, 0, 0.18);
  border: 1px dashed rgba(255, 200, 0, 0.5);
  z-index: 50;
  pointer-events: none;
  border-radius: 6px;
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
  top: 10%;
  left: -200%;
  width: 340px;
  height: 80%;
  overflow: auto;
  background: linear-gradient(180deg,#220000,#330000);
  color: #fff8f0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  transition: transform 0.25s ease, opacity 0.25s ease;
  z-index: 1000;
  padding: 1rem;
  border-left: 1px solid rgba(153,0,0,0.7);
  border-radius: 10px;
  transform: translateX(30px);
  opacity: 0;
}


.sidebar.visible {
  transform: translateX(0);
  opacity: 1;
  display: block;
  left: 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: linear-gradient(90deg, #2f2f33, #222224);
  color: #d1d1d6;
  padding: 0.6rem 1rem;
  font-weight: 700;
  font-size: 1.6rem;
  border-bottom: 1px solid rgba(70,70,75,0.3);
}

.dayTitle { text-align: center; }

.dayArrow {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.06);
  color: #cfcfd3;
  width: 44px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.12s ease;
}
.dayArrow:hover {
  background: rgba(255,255,255,0.02);
  transform: translateY(-2px);
  color: #ffffff;
}
.dayArrow.left { margin-right: 0.4rem }
.dayArrow.right { margin-left: 0.4rem }

/* small screens: stack columns and make timetable scrollable horizontally */
@media (max-width: 900px) {
  .timetable-program-columns {
    overflow-x: auto;
    display: flex;
    gap: 8px;
  }
  .timetable-time-column { display: none; }
  .timetable { overflow: auto; }
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  max-width: 320px;
  color: black;
}

.sidebar-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.edit-input,
.edit-textarea {
  width:90%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: #f9f9f9;
  transition: border 0.2s;
}

.edit-input:focus,
.edit-textarea:focus {
  border-color: #c41e3a;
  outline: none;
}

.edit-textarea {
  min-height: 80px;
  resize: vertical;
}

.edit-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.edit-btn,
.save-btn,
.cancel-btn,
.delete-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn {
  background: #c41e3a;
  color: #fff;
}

.save-btn {
  background: #28a745;
  color: #fff;
}

.cancel-btn {
  background: #6c757d;
  color: #fff;
}

.delete-btn {
  background-color: red;
  color: #fff;
}

.edit-btn:hover,
.save-btn:hover,
.cancel-btn:hover,
.delete-btn:hover {
  opacity: 0.9;
}

.multi-select-container {
  width: 260px;
  font-family: Arial, sans-serif;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-btn {
  width: 100%;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
}

.dropdown-btn:hover {
  background: #f3f3f3;
}

.dropdown-menu {
  position: absolute;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  width: 100%;
  max-height: 160px;
  overflow-y: auto;
  z-index: 100;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #e7e7e7;
}

.selected-tags {
  margin-top: 10px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  display: flex;
  align-items: center;
  background: #e1e5ff;
  color: #2a2a8d;
  padding: 5px 8px;
  border-radius: 20px;
  font-size: 14px;
}

.tag-remove {
  background: none;
  border: none;
  color: #2a2a8d;
  font-size: 16px;
  margin-left: 5px;
  cursor: pointer;
}

.tag-remove:hover {
  color: red;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
