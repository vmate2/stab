<template>
  <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
    <!-- Search and Filter Section -->
    <div class="searchFrame" ref="searchFrame">
      <div class="searchCont">
        <input type="text" name="SearchStabtag" v-model="searchquery" class="search" placeholder="Keresés név vagy telefonszám alapján">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24" style="position: relative; right: 7%; cursor: pointer;">
          <path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z"></path>
        </svg>
      </div>
    </div>

    <!-- Table Container -->
    <div class="tableContainer">
      <!-- Fixed Header -->
      <div class="listRow headerRow">
        <div class="listItem header" @click="toggleSort('típus')">
          Típus
          <span v-if="sortColumn === 'típus'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </div>
        <div class="listItem header" @click="toggleSort('név')">
          Név
          <span v-if="sortColumn === 'név'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </div>
        <div class="listItem header" @click="toggleSort('telefonszám')">
          Telefonszám
          <span v-if="sortColumn === 'telefonszám'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </div>
        <div class="listItem header" @click="toggleSort('felirat')">
          Felirat
          <span v-if="sortColumn === 'felirat'">
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
            <div class="listItem" style="grid-column: span 6; color: black; font-family: 'Courier New', Courier, monospace; font-weight: 800; font-size: 120%; user-select: none;">
              <div style="width: fit-content; cursor: pointer;" @click="addItem()">ÚJ ELEM HOZZÁADÁSA</div>
            </div>
          </div>
          <div v-for="(item, index) in sortedAndFilteredItems" :key="item.id" class="listRow" :class="{ even: index % 2 === 0, last: index === sortedAndFilteredItems.length - 1 }">
            <div class="listItem">{{ item.típus }}</div>
            <div class="listItem">{{ item.név }}</div>
            <div class="listItem">{{ item.telefonszám }}</div>
            <div class="listItem">{{ item.felirat || '-' }}</div>
            <div style="display: flex; justify-content: center; align-items: center;"><svg style="cursor: pointer;" @click="editItem(item.id)" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <div style="display: flex; justify-content: center; align-items: center;"><svg style="cursor: pointer;" @click="deleteItem(item.id)" fill="#000000" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1,20a1,1,0,0,0,1,1h8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5Zm12.707,9.707L20.414,17l2.293,2.293a1,1,0,1,1-1.414,1.414L19,18.414l-2.293,2.293a1,1,0,0,1-1.414-1.414L17.586,17l-2.293-2.293a1,1,0,0,1,1.414-1.414L19,15.586l2.293-2.293a1,1,0,0,1,1.414,1.414Z"/></svg></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Item Modal -->
    <div class="addStabtagCont growAnim" v-if="showAdd" ref="addStabtagCont">
      <div class="closeAdd">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="closeAdd()" style="cursor: pointer;">
          <path d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z" fill="#1C274C"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="#1C274C"/>
        </svg>
      </div>
      <div class="modalTitle">Új elem</div>
      <select v-model="newItem.típus" class="inputField">
        <option value="" selected hidden>Válassz típust!</option>
        <option value="póló">Póló</option>
        <option value="pulóver">Pulóver</option>
      </select>
      <input type="text" placeholder="Név" v-model="newItem.név" class="inputField">
      <input type="text" placeholder="Telefonszám" v-model="newItem.telefonszám" class="inputField">
      <input type="text" placeholder="Felirat (opcionális)" v-model="newItem.felirat" class="inputField">
      <button @click="addnewItem()" class="addBtn">Hozzáadás</button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'new'
});
import { ref, computed } from 'vue';

interface Item {
  id: number;
  típus: string;
  név: string;
  telefonszám: string;
  felirat: string | null;
}

// Reactive state
const searchquery = ref('');
const sortColumn = ref();
const sortDirection = ref<'asc' | 'desc' | null>(null);
const showAdd = ref(false);
const items = ref<Item[]>([
  { id: 1, típus: 'póló', név: 'Kiss Péter', telefonszám: '06301234567', felirat: 'Hello' },
  { id: 2, típus: 'pulóver', név: 'Nagy Anna', telefonszám: '06709876543', felirat: null },
  { id: 3, típus: 'pulóver', név: 'Nagy Anna Krisztina', telefonszám: '06709873543', felirat: 'asd' },
]);
const newItem = ref<Omit<Item, 'id'> & { id?: number }>({
  típus: '',
  név: '',
  telefonszám: '',
  felirat: '',
});

// Computed property for sorted and filtered items
const sortedAndFilteredItems = computed(() => {
  const filtered = items.value.filter((item) => {
    const searchTerms = searchquery.value.toLowerCase().split(' '); // Split search query into individual words
    const nameWords = item.név.toLowerCase().split(' '); // Split name into individual words
    const phone = item.telefonszám; // Get phone number
  
    // Check if all search terms match the start of corresponding words in the name or phone number
    return searchTerms.every((term) => {
      // Check if the term matches the start of any word in the name
      const nameMatch = nameWords.some((word) => word.startsWith(term));
      // Check if the term matches the start of the phone number
      const phoneMatch = phone.startsWith(term);
      return nameMatch || phoneMatch;
    });
  });

  if (sortColumn.value) {
    filtered.sort((a, b) => {
      const aValue = a[sortColumn.value as keyof Item] || '';
      const bValue = b[sortColumn.value as keyof Item] || '';
      if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filtered;
});

// Functions
const toggleSort = (column: string) => {
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

const addItem = () => {
  newItem.value = { típus: '', név: '', telefonszám: '', felirat: '' }; // Reset form for adding
  showAdd.value = true;
};

const closeAdd = () => {
  showAdd.value = false;
  newItem.value = { típus: '', név: '', telefonszám: '', felirat: '' }; // Reset form
};

const addnewItem = () => {
  if (newItem.value.típus && newItem.value.név && newItem.value.telefonszám) {
    if (newItem.value.id) {
      // Editing an existing item
      const index = items.value.findIndex((item) => item.id === newItem.value.id);
      if (index !== -1) {
        items.value[index] = { ...newItem.value, id: newItem.value.id };
      }
    } else {
      // Adding a new item
      items.value.push({
        id: items.value.length + 1,
        ...newItem.value,
      });
    }
    closeAdd();
  }
};

const editItem = (id: number) => {
  const item = items.value.find((item) => item.id === id);
  if (item) {
    newItem.value = { ...item }; // Populate the form with the item's data
    showAdd.value = true;
  }
};

const deleteItem = (id: number) => {
  if (confirm('Biztosan törölni szeretnéd ezt az elemet?')) {
    items.value = items.value.filter((item) => item.id !== id);
  }
};
</script>

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
  top: 10dvh;
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
  max-width: 1200px;
  position: relative;
  top: 10vh;
}

.listRow {
  width: 100%;
  height: 5vh;
  display: grid;
  grid-template-columns:repeat(6, 1fr);
  align-items: center;
  background-color: #797979;
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
  overflow-x: hidden; /* Allow horizontal overflow to show the border */
  width: 101%;
}


.listCont2 {
  width: 99%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  border: 2px solid white !important;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: all 0.3s;
}

.headerRow {
  font-weight: bold;
  background-color: #797979;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: 2px solid white;
  user-select: none;
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
    grid-template-columns:repeat(6, 1fr);
    font-size: 12px;
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
    grid-template-columns:repeat(6, 1fr);
    font-size: 10px;
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