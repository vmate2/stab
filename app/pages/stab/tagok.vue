<template>
  <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
    <!-- Search and Filter Section -->
    <div class="searchFrame" ref="searchFrame">
      <div class="searchCont">
        <input type="text" name="SearchStabtag" v-model="searchquery" class="search" placeholder="Stábtagok keresése">
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer; position: relative; right: 2%;" v-if="!filterExtended" @click="toggleFilter()">
          <path d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer; position: relative; right: 2%;" v-if="filterExtended" @click="toggleFilter()">
          <path d="M15 15L21 21M21 15L15 21M10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L17 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Filter Container -->
      <div class="filterCont" v-show="filterExtended">
        <div class="filterFrame">
          <!-- First Row -->
          <div class="filterRow">
            <!-- Role Dropdown -->
            <div class="filterItem">
              <label for="role">Válassz szerepkört:</label>
              <select id="role" v-model="selectedRole">
                <option value="" selected>Válassz szerepkört</option>
                <option value="Stábtag" >Stábtag</option>
                <option value="Kisfőnök">Kisfőnök</option>
                <option value="Kampányfőnök">Kampányfőnök</option>
                <option value="Jelölt">Jelölt</option>
              </select>
            </div>
          </div>

          <!-- Second Row -->
          <div class="filterRow">
            <!-- Iskola Dropdown -->
            <div class="filterItem">
              <label for="iskola">Iskola:</label>
              <select id="iskola" v-model="selectedIskola">
                <option value="">Válassz iskolát</option>
                <option v-for="school in sortedSchools" :key="school.value" :value="school.value">
                  {{ school.label }}
                </option>
              </select>
            </div>

            <!-- Város Dropdown -->
            <div class="filterItem">
              <label for="varos">Város:</label>
              <select id="varos" v-model="selectedVaros">
                <option value="">Válassz várost</option>
                <option v-for="city in sortedCities" :key="city.value" :value="city.value">
                  {{ city.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="tableContainer">
      <!-- Fixed Header -->
      <div class="listRow headerRow">
        <div class="listItem header" @click="toggleSort('name')">
          Név
          <span v-if="sortColumn === 'name'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </div>
        <div class="listItem header" @click="toggleSort('post')">
          Poszt
          <span v-if="sortColumn === 'post'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </div>
        <div class="listItem header" @click="toggleSort('email')">
          Email
          <span v-if="sortColumn === 'email'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </div>
        <div class="listItem header" @click="toggleSort('phone')">
          Telefonszám
          <span v-if="sortColumn === 'phone'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </div>
        <div class="listItem header" @click="toggleSort('paid')">
          Fizetett Stabcash
          <span v-if="sortColumn === 'paid'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </div>
        <div class="listItem header" @click="toggleSort('school')">
          Iskola
          <span v-if="sortColumn === 'school'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </div>
        <div class="listItem header" @click="toggleSort('city')">
          Város
          <span v-if="sortColumn === 'city'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </div>
        <div class="listItem header">Szerkesztés</div>
        <div class="listItem header">Törlés</div>
      </div>

      <!-- Scrollable Rows -->
      <div class="listCont2Div" ref="listCont2">
        <div class="listCont2">
          <div class="listRow">
            <div class="listItem" style="grid-column: span 9; color: black; font-family: 'Courier New', Courier, monospace; font-weight: 800; font-size: 120%; user-select: none;">
              <div style="width: fit-content; cursor: pointer;" @click="addStabtag()">STÁBTAG HOZZÁADÁSA</div>
            </div>
          </div>
          <client-only>
          <div v-if="sortedAndFilteredPeople" v-for="(person, index) in sortedAndFilteredPeople" :key="person.id" class="listRow" :class="{ even: index % 2 === 0, last: index === sortedAndFilteredPeople.length - 1 }">
            <div class="listItem">{{ person.name }}</div>
            <div class="listItem">{{ person.post }}</div>
            <div class="listItem">{{ person.email }}</div>
            <div class="listItem">{{ person.phone }}</div>
            <div class="listItem">{{ person.paid || 0 }}Ft</div>
            <div class="listItem">{{ person.school }}</div>
            <div class="listItem">{{ person.city }}</div>
            <div><svg style="cursor: pointer;" @click="modify(index)" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <div><svg style="cursor: pointer;" @click="del(index)" fill="#000000" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1,20a1,1,0,0,0,1,1h8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5Zm12.707,9.707L20.414,17l2.293,2.293a1,1,0,1,1-1.414,1.414L19,18.414l-2.293,2.293a1,1,0,0,1-1.414-1.414L17.586,17l-2.293-2.293a1,1,0,0,1,1.414-1.414L19,15.586l2.293-2.293a1,1,0,0,1,1.414,1.414Z"/></svg></div>
          </div>
          <div v-else>
            asd
          </div>
        </client-only>
        </div>
      </div>
      <div class="exportButtonContainer">
        <button @click="exportToExcel()" class="exportButton">Excel fájl létrehozása</button>
      </div>
    </div>

    <!-- Add Stabtag Modal -->
    <div class="addStabtagCont growAnim" v-if="showAdd" ref="addStabtagCont">
      <div class="closeAdd">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="closeAdd()" style="cursor: pointer;">
          <path d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z" fill="#1C274C"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="#1C274C"/>
        </svg>
      </div>
      <div class="modalTitle">Új stábtag</div>
      <input type="text" placeholder="Név" v-model="nev" class="inputField">
      <select v-model="poszt" class="inputField">
        <option value="" selected hidden>Válassz posztot!</option>
        <option value="Stábtag">Stábtag</option>
        <option value="Kisfőnök">Kisfőnök</option>
        <option value="Kampányfőnök">Kampányfőnök</option>
        <option value="Jelölt">Jelölt</option>
      </select>
      <input type="text" placeholder="E-mail" v-model="email" class="inputField">
      <input type="text" placeholder="Telefonszám" v-model="telefonszam" class="inputField">
      <button @click="addnewtag()" class="addBtn">Hozzáadás</button>
    </div>
  </div>
</template>

<style scoped>
/* General Styles */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

/* Search and Filter Section */
.searchFrame {
  width: 90%;
  max-width: 600px;
  min-height: 5vh;
  position: relative;
  top: 0;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.searchCont {
  width: 100%;
  height: 4vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 1;
}

.search {
  width: 80%;
  border-radius: 2vh;
  height: 4vh;
  padding: 0 0.5vw;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
  font-size: 100%;
}

.filterCont {
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  height: 0vh;
  position: relative;
}

.filterFrame {
  display: flex;
  flex-direction: column;
  gap: 1vh;
  border: 2px solid white;
  border-radius: 15px;
  padding: 1vh;
}

.filterRow {
  display: flex;
  gap: 2vh;
  align-items: center;
}

.filterItem {
  display: flex;
  align-items: center;
  gap: 0.5vh;
}

label {
  font-weight: bold;
  margin-right: 0.5vh;
}

select {
  padding: 0.5vh;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 100%;
}

/* Table Container */
.tableContainer {
  width: 90%;
  position: relative;
}

.listRow {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 2fr) 1fr 1fr;
  align-items: center;
  justify-items: center;
  font-family: 'Inter', sans-serif;
  font-size: 1rem; /* Default font size */
  border-bottom: 1px solid black;
  user-select: text !important;
  min-height: auto;
  height: fit-content;
  overflow: visible;
}

.listRow.even {
  background-color: #d5d5d5;
  color: black;
}

.listRow.last {
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

.listItem {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5vh;
}

.listItem span {
  margin-left: 5px;
  font-size: 12px;
}

.listCont2Div {
  overflow-y: auto;
  height: 70vh;
  overflow-x: hidden;
}

.listCont2 {
  width: 100%;
  height: auto;
  background-color: gray;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  display: flex;
  flex-direction: column;
  max-height: 80vh; /* Ensures the body doesn't overflow */
  overflow-y: auto; /* Allows scrolling only on the Y-axis */
  overflow-x: hidden; /* Ensures no horizontal scrolling */
}

.headerRow {
  font-weight: bold;
  background-color: #797979;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: 2px solid white;
}

.header {
  cursor: pointer;
}

/* Add Stabtag Modal */
.addStabtagCont {
  width: 90%;
  max-width: 600px;
  height: 50vh;
  background-color: #797979;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  border-radius: 2vh;
  border: 2px solid white;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  flex-direction: column;
}

.growAnim {
  animation: grow 0.6s ease;
}

.shrinkAnim {
  animation: shrink 0.7s ease;
}

.closeAdd {
  width: 98%;
  height: 8%;
  display: flex;
  justify-content: end;
  align-items: center;
}

.modalTitle {
  color: white;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 700;
  font-size: xx-large;
  user-select: none;
  -webkit-text-stroke: 1px black;
  margin-bottom: 1vh;
}

.inputField {
  user-select: none;
  width: 80%;
  height: 7%;
  border-radius: 1vh;
  outline: none;
  border: 2px solid #4d4d4d;
  margin-bottom: 2vh;
  padding: 0 5px;
  background-color: #b1b1b1;
  color: black;
  padding-block: 1px;
  padding-inline: 2px;
  font-size: 80%;
}

.inputField::placeholder {
  color: #414141;
}

.addBtn {
  width: 20%;
  height: 8%;
  border-radius: 10px;
  user-select: none;
  margin-top: 5vh;
}

.addBtn:hover {
  background-color: #4d4d4d;
  color: #d5d5d5;
}

/* Export Button */
.exportButtonContainer {
  width: 100%;
  display: flex;
  justify-content: end;
}

.exportButton {
  border-radius: 5px;
}

/* Media Queries for Mobile */
@media (max-width: 768px) {
  .searchFrame {
    width: 95%;
  }

  .searchCont {
    width: 100%;
  }

  .search {
    width: 90%;
  }

  .tableContainer {
    width: 95%;
  }

  .listRow {
    grid-template-columns: 1fr; /* Egy oszlopra váltás mobilon */
    text-align: center;
    font-size: 0.9em; /* Smaller font size for smaller screens */
  }

  .listItem {
    padding: 0.2vh;
  }

  .addStabtagCont {
    width: 95%;
    height: 60vh;
  }

  .inputField {
    width: 90%;
  }

  .addBtn {
    width: 30%;
  }
}

@media (max-width: 480px) {
  .listRow {
    grid-template-columns: 1fr; /* Egy oszlopra váltás mobilon */
    text-align: center;
    font-size: 0.9em;
  }

  .headerRow {
    display: none;
  }

  .listItem {
  padding: 0.5em; /* Use relative units for padding */
  font-size: 1rem; /* Base font size */
  box-sizing: border-box; /* Ensure padding is included in the element's dimensions */
}

/* Responsive adjustments using media queries */
@media (max-width: 768px) {
  .listItem {
    padding: 0.3em; /* Smaller padding for smaller screens */
    font-size: 0.9rem; /* Smaller font size for smaller screens */
  }
}

@media (max-width: 480px) {
  .listItem {
    padding: 0.2em; /* Even smaller padding for very small screens */
    font-size: 0.8rem; /* Even smaller font size for very small screens */
  }
}

  .addStabtagCont {
    width: 95%;
    height: 70vh;
  }

  .inputField {
    width: 95%;
  }

  .addBtn {
    width: 40%;
  }
}

@keyframes grow {
  0% {
    scale: 0;
  }
  100% {
    scale: 1;
  }
}

@keyframes shrink {
  0% {
    scale: 1;
    opacity: 1;
  }
  100% {
    scale: 0;
    opacity: 0;
  }
}

/* Custom scrollbar for WebKit browsers (Chrome, Edge, Safari) */
.listCont2Div::-webkit-scrollbar {
  width: 10px;
}

.listCont2Div::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

.listCont2Div::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

.listCont2Div::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Hide the up and down arrows */
.listCont2Div::-webkit-scrollbar-button {
  border-radius: 20px;
}

/* Optional: Firefox scrollbar styling (limited support) */
.listCont2Div {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.editBtn {
  background-color: #4CAF50; /* Green */
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.editBtn:hover {
  background-color: #45a049;
}

.deleteBtn {
  background-color: #f44336; /* Red */
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.deleteBtn:hover {
  background-color: #da190b;
}
</style>

<script lang="ts" setup>
definePageMeta({
  layout: 'new'
});

const layoutData: any = inject('layoutData');



const { $notify } = useNuxtApp();
const { $showDialog } = useNuxtApp();

const nev = ref('');
const poszt = ref('');
const email = ref('');
const telefonszam = ref('');

const listCont2 = ref()

const username = ref('');
const password = ref('');

const searchquery = ref('');
const searchFrame = ref();
const filterExtended = ref(false);
const addStabtagCont = ref()

// Dropdown and checkbox values
const selectedRole = ref(''); // Default selected role
const fizetettStabcash = ref(0); // Default value is 0
const selectedIskola = ref(''); // Dropdown for "Iskola"
const selectedVaros = ref(''); // Dropdown for "Város"

// Sorting state
const sortColumn = ref<'name' | 'post' | 'email' | 'phone' | 'paid' | 'school' | 'city' | null>(null);
const sortDirection = ref<'asc' | 'desc' | null>(null);

interface Person {
  id: string;
  name: string;
  post: string;
  email: string;
  phone: string;
  paid: number;
  school: string;
  city: string;
}

interface City {
  value: string;
  label: string;
}

interface School {
  value: string;
  label: string;
}

interface CreateUserResponse {
  id?: string;
  username?: string;
  password?: string;
  message?: string;
}

const people = ref<Person[]>(layoutData.value.users);
  console.log(people.value);

const cities: City[] = [
  { value: 'Békécsaba', label: 'Békécsaba' },
  { value: 'Békés', label: 'Békés' },
  { value: 'Gyula', label: 'Gyula' },
  { value: 'Mezőkovácsháza', label: 'Mezőkovácsháza' },
  { value: 'Medgyesegyháza', label: 'Medgyesegyháza' },
  { value: 'Orosháza', label: 'Orosháza' },
  { value: 'Bánkút', label: 'Bánkút' },
  { value: 'Kondoros', label: 'Kondoros' },
  { value: 'Szarvas', label: 'Szarvas' },
  { value: 'Kígyós', label: 'Kígyós' },
  { value: 'Sarkad', label: 'Sarkad' },
  { value: 'Doboz', label: 'Doboz' },
  { value: 'Kamut', label: 'Kamut' },
  { value: 'Dévaványa', label: 'Dévaványa' },
  { value: 'Csorvás', label: 'Csorvás' },
  { value: 'Tótkomlós', label: 'Tótkomlós' },
  { value: 'Vésztő', label: 'Vésztő' },
  { value: 'Battonya', label: 'Battonya' },
  { value: 'Mezőberény', label: 'Mezőberény' },
  { value: 'Gyomaendrőd', label: 'Gyomaendrőd' },
  { value: 'Újkígyós', label: 'Újkígyós' },
  { value: 'Kétegyháza', label: 'Kétegyháza' },
  { value: 'Nagyszénás', label: 'Nagyszénás' },
  { value: 'Békésszentandrás', label: 'Békésszentandrás' },
  { value: 'Körösladány', label: 'Körösladány' },
  { value: 'Köröstarcsa', label: 'Köröstarcsa' },
  { value: 'Körösújfalu', label: 'Körösújfalu' },
  { value: 'Körösladány', label: 'Körösladány' },
  { value: 'Körösnagyharsány', label: 'Körösnagyharsány' },
  { value: 'Körösújfalu', label: 'Körösújfalu' },
  { value: 'Körösújfalu', label: 'Körösújfalu' },
];

const schools: School[] = [
  { value: 'Trefort', label: 'Trefort' },
  { value: 'Keri', label: 'Keri' },
  { value: 'Szegya', label: 'Szegya' },
  { value: 'Vízmű', label: 'Vízmű' },
  { value: 'Andrássy', label: 'Andrássy' },
  { value: 'Belvár', label: 'Belvár' },
  { value: 'BEG', label: 'BEG' },
];

// Computed property for filtered people
const filteredPeople = computed(() => {
  return people.value.filter(person => {
    const matchesSearch = person.name.toLowerCase().startsWith(searchquery.value.toLowerCase());
    const matchesSchool = !selectedIskola.value.toLowerCase() || person.school.toLowerCase() === selectedIskola.value.toLowerCase();
    const matchesCity = !selectedVaros.value.toLowerCase() || person.city.toLowerCase() === selectedVaros.value.toLowerCase();
    const matchesRole = !selectedRole.value.toLowerCase() || person.post.toLowerCase() === selectedRole.value.toLowerCase();
    const matchesPaid = fizetettStabcash.value === 0 || person.paid >= fizetettStabcash.value;

    return matchesSearch && matchesRole && matchesPaid && matchesSchool && matchesCity;
  });
});

// Apply sorting to filteredPeople
const sortedAndFilteredPeople = computed(() => {
  let result = [...filteredPeople.value];

  if (sortColumn.value && sortDirection.value) {
    result.sort((a, b) => {
      const aValue = a[sortColumn.value as keyof Person];
      const bValue = b[sortColumn.value as keyof Person];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection.value === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection.value === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
      return 0;
    });
  }

  return result;
});

// Toggle sorting for a column
const toggleSort = (column: typeof sortColumn.value) => {
  if (sortColumn.value === column) {
    // Cycle through sorting directions: none -> asc -> desc -> none
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc';
    } else if (sortDirection.value === 'desc') {
      sortColumn.value = null;
      sortDirection.value = null;
    } else {
      sortDirection.value = 'asc';
    }
  } else {
    // Start sorting by the new column in ascending order
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

const addnewtag = async () => {
  if (nev.value && poszt.value && email.value && telefonszam.value) {
    const response:any = await createNewTag(nev.value, poszt.value, email.value, telefonszam.value);
    console.log('asdasdasdasd')
    if (response.success === true) {
      //closeAdd()
      //TODO refresh list after adding new tag to list
      //TODO show success message
      //TODO show error message
      //TODO show loading spinner 
    } else {
      alert('Valami probléma történt, próbáld újra később!');
      //closeAdd()
    }
  } else {
    alert('Tölts ki minden mezőt!');
  }
};

async function createNewTag(nev: string, poszt: string, email: string, telefonszam: any) {
  const {data, status, error} = await useFetch<createUserResponse>('/api/users/createUser', {
    method: 'POST',
    body: {
      nev,
      poszt,
      email,
      telefonszam
    }
  });
  console.log(data);
  while (status.value === 'pending') {
    console.log('loading');
  }
  if (error.value) {
    $notify("Sikertelen hozzáadás!", "error");
    return { success: false };
  } else {
    return { success: true };
}
}

interface createUserResponse {
  id?: string;
  username?: string;
  password?: string;
  message?: string;
}

const hasClickedFilter = ref(false);

const toggleFilter = () => {
  filterExtended.value = !filterExtended.value;
  hasClickedFilter.value = true;
  if (filterExtended.value) {
    listCont2.value.style.height = '45vh'
    searchFrame.value.style.height = '25vh';
  } else {
    listCont2.value.style.height = '70vh'
    searchFrame.value.style.height = '5vh';
  }
};

const search = () => {
  // Trigger filtering when search is clicked
  hasClickedFilter.value = true;
};


const sortedCities = cities.sort((a, b) => a.label.localeCompare(b.label));



const sortedSchools = schools.sort((a, b) => a.label.localeCompare(b.label));

const showAdd = ref(false)

const addStabtag = () => {
  showAdd.value = true;
}
const closeAdd = () => {
  addStabtagCont.value.classList.remove('growAnim');
  addStabtagCont.value.classList.add('shrinkAnim');
  setTimeout(() => {
    showAdd.value = false;
    addStabtagCont.value.classList.remove('shrinkAnim');
    nev.value = '';
    poszt.value = '';
    email.value = '';
    telefonszam.value  = '';
  }, 600);
  return true;
}



</script>