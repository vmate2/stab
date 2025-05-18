<template>
  <div class="table-container">
    <div class="action-container">
      <div class="filter-container">
          <input type="text" v-model="searchQuery" placeholder="Keresés..." class="search-bar" />
          <div class="select-filters">
              <div v-for="(column, index) in tableData.head" :key="index" class="select-filter">
                  <label :for="`filter-${index}`">{{ column.text }}</label>
                  <select :id="`filter-${index}`" v-model="filters[column.value]">
                      <option value="">Mind</option>
                      <option v-for="option in getUniqueColumnValues(column.value)" :key="String(option)" :value="option">
                          {{ option }}
                      </option>
                  </select>
              </div>
          </div>
      </div>
      <div class="actions-container filter-container" v-if="jogosult">
        <div>
          <div @click="emitAction('import')" class="text">Importálás</div>
          <div @click="emitAction('export')" class="text">Exportálás</div>
          <div v-for="(button, index) in customButtons" :key="`custom-button-${index}`" @click="emitAction('buttonClick', button.name)" class="text">{{ button.label }}</div>
          <div></div> 
        </div>
      </div>
    </div>
    <div class="table-wrapper" >
      <table class="custom-table" @scroll.passive="onScroll" ref="container">
          <thead>
              <tr>
                  <th v-for="(item, index) in tableData.head || []" :key="index" @click="sortTable(index)"   :style="{ width: columnPercents[index] }">
                      {{ item.text || '' }}
                      <span v-if="sortColumn === index">
                          {{ sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '' }}
                      </span>
                  </th>
                  <th v-if="jogosult" style="cursor: default;">Módosítás</th>
                  <th v-if="jogosult" style="cursor: default;">Törlés</th>
              </tr>
          </thead>
          <tbody>
            <tr class="add-row">
              <td :colspan="tableData.head.length + 2 + customButtons.length" class="add-row-cell">
                <button @click="emitAction('add', '')" class="add-row-button">Új hozzáadása</button>
              </td>
            </tr>
            <!-- spacer top -->
            <tr style="height: 0" aria-hidden="true">
              <td :colspan="tableData.head.length + 2 + customButtons.length" :style="{ height: `${topSpacerHeight}px` }"></td>
            </tr>
            <tr
              v-for="(item, i) in visibleRows"
              :key="startIndex + i"
            >
              <td
                v-for="(subItem, subIndex) in tableData.head"
                :key="subIndex"
                ref="setColumnRef"
                :style="{ width: columnPercents[subIndex] }"
              >
                {{ item?.[subItem.value]?.value || item?.[subItem.value] || ' ' }}
              </td>
              <td v-if="jogosult" class="clickable" @click="emitAction('modify', item)">
                M
              </td>
              <td v-if="jogosult" class="clickable" @click="emitAction('delete', item)">
                X
              </td>
            </tr>
            <!-- spacer bottom -->
            <tr style="height: 0" aria-hidden="true">
              <td :colspan="tableData.head.length + 2 + customButtons.length" :style="{ height: `${bottomSpacerHeight}px` }"></td>
            </tr>
          </tbody>

      </table>
    </div>
  </div>
  <div class="scroll-button" @click="scrollToBottom"  v-if="showScrollButton">Scroll to Bottom</div>
</template>

<script lang="ts" setup>


const container = ref<HTMLElement | null>(null);
const seventyVh = ref(0);
const showScrollButton = ref(false);

const visibleRowCount = ref(0);
const bufferRowCount = ref(0);

onMounted(() => {
  seventyVh.value = window.innerHeight * 0.7;

  // várjuk, hogy container betöltődjön
  nextTick(() => {
    if (container.value) {
      const height = container.value.offsetHeight;
      showScrollButton.value = height > seventyVh.value;
    }
    const table = container.value;
    if (table) {
      const tableHeight = table.clientHeight;
      const rowHeight = 44; // átlagos érték (px)
      visibleRowCount.value = Math.floor(tableHeight / rowHeight);
      if (visibleRowCount.value <= 5) {
        bufferRowCount.value = 2;
      } else {
        bufferRowCount.value = Math.floor(visibleRowCount.value * 0.3); // 30% buffer
      }
      console.log(`Látható sorok száma: ${visibleRowCount.value}, Buffer sorok száma: ${bufferRowCount.value}`);
    }
    columnWidths.value = columnRefs.value.map(el => el?.offsetWidth || 0);
  });
});

// Define props to accept the data and custom buttons from the parent component
const props = defineProps({
  tableData: {
    type: Object,
    required: true
  },
  customButtons: {
    type: Array as PropType<Array<{ name: string; label: string }>>,
    required: false,
    default: () => []
  },
  currentUser: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(['cell-click', 'buttonClick', 'import', 'export', 'modify', 'delete', 'add']);

import { ref, computed, toRefs, reactive, watch } from 'vue';

// Ensure reactivity for tableData when passed as a ref
const { currentUser, tableData } = toRefs(props);

// Ensure currentUser is not a promise
interface User {
  post?: string;
}

const resolvedCurrentUser = ref<User | null>(null);
const jogosult = ref(false);


watchEffect(() => {
  if (currentUser.value instanceof Promise) {
    currentUser.value.then((resolved) => {
      resolvedCurrentUser.value = resolved;
      if (resolvedCurrentUser.value) {
        console.log(resolvedCurrentUser.value.post);
      }
      jogosult.value = !!(resolvedCurrentUser.value && (resolvedCurrentUser.value.post === 'Kampányfőnök' || resolvedCurrentUser.value.post === 'Jelölt'));
    });
  }
});


// State for sorting
const sortColumn = ref<number | null>(null);
const sortOrder = ref<'asc' | 'desc' | null>(null);

// Computed property for sorted data
const sortedData = computed(() => {
  if (sortColumn.value === null || sortOrder.value === null) {
    return tableData.value.body || [];
  }

  const sorted = [...(tableData.value.body || [])].sort((a, b) => {
    const aValue = sortColumn.value !== null ? a?.[tableData.value.head[sortColumn.value].value] || '' : '';
    const bValue = sortColumn.value !== null ? b?.[tableData.value.head[sortColumn.value].value] || '' : '';

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
});

// Function to handle sorting
const sortTable = (columnIndex: number) => {
  if (sortColumn.value === columnIndex) {
    // Cycle through sort orders: asc -> desc -> none
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : sortOrder.value === 'desc' ? null : 'asc';
    if (sortOrder.value === null) {
      sortColumn.value = null; // Reset sorting
    }
  } else {
    sortColumn.value = columnIndex;
    sortOrder.value = 'asc';
  }
};

// Function to scroll to the bottom of the table with smooth behavior
const scrollToBottom = () => {
  const table = document.querySelector('.custom-table');
  if (table) {
    table.scrollTo({ top: table.scrollHeight, behavior: 'smooth' });
  }
};

// Function to emit actions for modify and delete
const emitAction = (action: 'cell-click' | 'buttonClick' | 'import' | 'export' | 'modify' | 'delete' | 'add', row?: any) => {
  console.log(`Action: ${action}`, row);
  emit(action, row);
};


// If you want to log and check the value of tableData
console.log(tableData.value);

const searchQuery = ref('');
const filters = reactive<Record<string, string>>({});

// Initialize filters for each column
watch(
  () => tableData.value.head,
  (newHead) => {
    newHead.forEach((column: { value: string }) => {
      filters[column.value] = '';
    });
  },
  { immediate: true }
);

// Filtered and searched data
const filteredData = computed(() => {
  return sortedData.value.filter((row: Record<string, any>) => {
    // Apply search query
    const matchesSearch = Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    // Apply column filters
    const matchesFilters = Object.keys(filters).every((key) => {
      return !filters[key] || row[key] === filters[key];
    });

    return matchesSearch && matchesFilters;
  });
});

// Function to get unique values for a column
const getUniqueColumnValues = (columnKey: string) => {
  const uniqueValues = new Set();
  tableData.value.body.forEach((row: Record<string, any>) => {
    if (row[columnKey]) {
      uniqueValues.add(row[columnKey]);
    }
  });
  return Array.from(uniqueValues) as string[];
};

const scrollTop = ref(0);

const rowHeight = 44; // px
const startIndex = ref(0);

const onScroll = () => {
  console.log(`Scroll event triggered`);
  
  if (container.value) {
    console.log(`Scroll position: ${container.value.scrollTop}`);
    
    scrollTop.value = container.value.scrollTop;
    startIndex.value = Math.floor(scrollTop.value / rowHeight);
  }
};


const visibleRows = computed(() => {
  const from = Math.max(0, startIndex.value - bufferRowCount.value);
  const to = from + visibleRowCount.value + bufferRowCount.value * 2;
  return filteredData.value.slice(from, to);
});

const topSpacerHeight = computed(() => {
  return Math.max(0, (startIndex.value - bufferRowCount.value) * rowHeight);
});

const bottomSpacerHeight = computed(() => {
  const remaining = filteredData.value.length - (startIndex.value + visibleRowCount.value + bufferRowCount.value);
  return Math.max(0, remaining * rowHeight);
});

const columnWidths = ref<number[]>([]); // pixel értékek
const columnPercents = computed(() => {
  const total = columnWidths.value.reduce((a, b) => a + b, 0);
  return columnWidths.value.map(w => `${(w / total) * 100}%`);
});
const columnRefs = ref<Array<HTMLElement | null>>([]);

function setColumnRef(el: HTMLElement | null) {
  if (el && !columnRefs.value.includes(el)) {
    columnRefs.value.push(el);
  }
}

</script>

<style scoped>

.table-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  overflow: auto;
}

.actions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
}

.table-wrapper {
  overflow-x: auto;
  max-width: 100%;
}

.actions-container .text{
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background-color: #808080;
  border-radius: 5px;
  padding: 3px;
  border: 1px solid white;
  margin: 10% auto;
}

.actions-container .text:hover {
  background-color: #007BFF;
  color: white;
  border: 1px solid white;
}

.action-container {
  display: flex;
  gap: 10px;
  justify-self: center;
  justify-content: center;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  justify-self: center;
  border: 2px solid white;
  padding: 10px;
  border-radius: 8px;
}

.search-bar {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 95%;
}

.select-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: black;
}

.select-filter {
  display: flex;
  flex-direction: column;
}

.select-filter label {
  margin-bottom: 5px;
  font-size: 14px;
  color: #f4f4f4;
}

.select-filter select {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom:5px;
  font-size: 16px;
  text-align: left;
  max-height: 70vh;
  overflow-y: auto;
  display: block;
  table-layout: fixed; /* Ensures columns fill out the space */
}

.custom-table thead {
  background-color: #f4f4f4;
  position: sticky;
}

.custom-table th, .custom-table td {
  border: 1px solid #ddd;
  padding: 8px;
  word-wrap: break-word;
  min-width: 30%; /* vagy ami az adatokhoz ésszerű */
}

.custom-table th {
  cursor: pointer;
}

.custom-table td.clickable {
  cursor: pointer;
  color: #007BFF;
  text-decoration: underline;
  justify-content: center;
  justify-self: center;
  align-items: center;
  align-self: center;
  width: fit-content;
  text-align: center; /* Center the text horizontally */
  vertical-align: middle; /* Center the text vertically */
}

.custom-table td.clickable:active {
  scale: 0.9;
}

.custom-table th {
  background-color: #007BFF;
  color: white;
  text-transform: uppercase;
  text-align: center;
}

.custom-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
.custom-table tr:nth-child(odd) {
  background-color: #808080;
}

.custom-table tr:hover {
  background-color: #d4d4d4;
}

.scroll-button {
  padding: 8px 12px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: fit-content;
  justify-self: center;
}

.custom-table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Prevents text from wrapping */
  font-size: 1.1rem; /* Adjust font size */
}

.scroll-button:hover {
  background-color: #0056b3;
}

.add-row {
  background-color: #f9f9f9;
  text-align: center;
}

.add-row-cell {
  padding: 10px;
}

.add-row-button {
  padding: 8px 16px;
  font-size: 14px;
  color: white;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-row-button:hover {
  background-color: #0056b3;
}

/* Add responsiveness */
@media (max-width: 971px) {
  .custom-table {
    font-size: 14px;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .actions-container {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 1285px) {
  .custom-table {
    font-size: 15px;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .action-container {
    flex-direction: column;
    align-items: center;
  }
  .actions-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .custom-table th, .custom-table td {
    padding: 6px;
  }
  .table-container {
    max-width: 90%;
  }
}

@media (max-width: 768px) {
  .actions-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-container {
    flex-direction: column;
    align-items: center;
  }

  .custom-table {
    font-size: 14px;
    max-height: 65vh;
  }

  .custom-table th, .custom-table td {
    padding: 6px;
  }
  .custom-table th {
    font-size: 1rem;
  }
  .custom-table td {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .custom-table {
    font-size: 12px;
  }
  .action-container {
    flex-direction: column;
    align-items: center;
  }

  .custom-table th, .custom-table td {
    padding: 4px;
  }
  .custom-table th {
    font-size: 0.7rem;
  }
  .custom-table td {
    font-size: 0.6rem;
  }
}
</style>