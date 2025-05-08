<template>
  <profile></profile>
  <div class="mainContainer">
  <form class="CreateTransactionContainer" @submit.prevent="sendTransaction">
    <div class="formTitle">Új tranzakció létrehozása</div>
    <label for="transactionName" class="transactionLabel">Tranzakció címe</label>
    <input id="transactionName" type="text" placeholder="Írja be a tranzakció címét" v-model="transaction.name" />
    <label for="transactionType" class="transactionLabel">Típus:</label>
    <select name="transactionType" id="transactionType" v-model="transaction.type" @change="transaction.category = ''; handleUpdate()" >
      <option value="0" disabled selected hidden >Válassza ki a tranzakció típusát</option>
      <option value="1">Bevétel</option>
      <option value="2">Kiadás</option>
    </select>
    <label for="transactionAmount" class="transactionLabel">Mennyiség: </label>
    <input type="number" id="transactionAmount" placeholder="Írja be a tranzakció mennyiségét" v-model="transaction.amount" @change="handleUpdate()"/>
    <label for="transactionCategory" class="transactionLabel">Kategória:</label>
    <select name="transactionCategory" id="transactionCategory" v-model="transaction.category" v-if="transaction.type == 1">
      <option value="" disabled selected hidden>Válassza ki a tranzakció kategóriáját</option>
      <option value="sponsor">Szponzor</option>
      <option value="gift">Ajándék</option>
      <option value="other">Egyéb</option>
    </select>
    <select name="transactionCategory" id="transactionCategory" v-model="transaction.category" v-else-if="transaction.type == 2">
      <option value="" disabled selected hidden>Válassza ki a tranzakció kategóriáját</option>
      <option value="food">Étel</option>
      <option value="decor">Díszlet</option>
      <option value="programs">Programok</option>
      <option value="rent">Bérlési díj</option>
      <option value="other">Egyéb</option>
    </select>
    <select name="transactionCategory" id="transactionCategory" v-model="transaction.category" v-else>
      <option value="" disabled selected hidden>Válassza ki a tranzakció típusát</option>
    </select>
    <label for="transactionDescription" class="transactionLabel">Leírás: <i>(opcionális)</i></label>
    <input type="text" name="transactionDescription" id="transactionDescription" placeholder="Írja be a tranzakció leírását" v-model="transaction.description" />
    <label for="transactionPic" class="transactionLabel">Kép: <i>(opcionális)</i></label>
    <input
      type="file"
      name="transactionPic"
      id="transactionPic"
      accept="image/*"
      @change="handleFileUpload"
    />
    <button type="submit" class="submitButton">Beküldés</button>
  </form>
    <div class="chartContainer">
      <canvas ref="balanceChart" ></canvas>
    </div>
</div>
  <spinner v-if="loading"></spinner>
  <notification></notification>
  
</template>

<script lang="ts" setup>

definePageMeta({
  layout: 'penzugy',
  middleware: 'auth',
});

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const currentUser = useAuth();
console.log(currentUser.token.value);

const route = useRoute();

const transactionID = ref(route.query.id?.toString() || 'undefined');
console.log('transactionID: ', transactionID.value);


const balanceChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const updateChart = () => {
  if (!balanceChart.value) return;

  if (chartInstance) {
    chartInstance.data.datasets[0].data = [projectedIncoming.value, projectedOutgoing.value];
    chartInstance.update();
    return;
  }

  chartInstance = new Chart(balanceChart.value, {
    type: 'bar',
    data: {
      labels: ['Bevétel', 'Kiadás'],
      datasets: [{
        label: 'Összeg (Ft)',
        data: [projectedIncoming.value, projectedOutgoing.value],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#fff' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#fff' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#fff' }
        }
      }
    }
  });
};



const projectedIncoming = ref(0);
const projectedOutgoing = ref(0);
const actualIncoming = ref(0);
const actualOutgoing = ref(0);
const projectedBalance = ref(0);
const actualBalance = ref(0);

const getCurrentData = async () => {
  console.log(currentUser.token.value);
  
  const { data, status, error, refresh } = await useFetch<{ income: number, expense: number, balance: number }>('/api/transactions', {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${currentUser.token.value}`,
      'type': 'getBalance'
    },
  });
  console.log(data.value);
  console.log(status.value);
  
  if (data.value) {
    actualBalance.value = data.value.balance;
    actualIncoming.value = data.value.income;
    actualOutgoing.value = data.value.expense;
    projectedBalance.value = data.value.balance;
    projectedIncoming.value = data.value.income;
    projectedOutgoing.value = data.value.expense;
    console.log(projectedIncoming.value);
    console.log(projectedOutgoing.value);
    
    updateChart();
  }


  
};
console.log( await getCurrentData())
onMounted( async() => {

});

const loading = ref(false);

const sendTransaction = async () => {
  loading.value = true;
  if (!transaction.value.name || !transaction.value.type || !transaction.value.amount) {
    $notify('Kérjük, töltse ki az összes kötelező mezőt!', 'error');
    loading.value = false;
    return;
  } else {
    console.log(transaction.value);
    const date = new Date();
    const { data, status, error, refresh } = await useFetch('/api/transactions/', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${currentUser.token.value}`,
      },
      body: {
        transaction: {
          id: transaction.value.id,
          userId: currentUser.user.value.uuid || '',
          name: transaction.value.name,
          type: transaction.value.type,
          amount: transaction.value.amount,
          date: date,
          description: transaction.value.description,
          picture: transaction.value.picture,
          category: transaction.value.category
        }
      }
    });

    if (error.value) {
      $notify('Hiba történt a tranzakció létrehozásakor!', 'error');
      console.error('Hiba történt a tranzakció létrehozásakor!');
      
      console.error(error.value);
      console.warn(status.value);
      console.warn(data.value);  
      
      loading.value = false;
      return;
    } 
    if (data.value) {
      $notify('Sikeresen létrehozta a tranzakciót!', 'success');
      transaction.value = {
        id: undefined,
        name: undefined,
        type: 0,
        amount: undefined,
        date: undefined,
        description: undefined,
        picture: undefined,
        category: '',
        userId: currentUser.user.value.uuid || ''
      };
      getCurrentData();
      updateChart();
      transactionID.value = genTransactionID().toString();
      route.query.id = transactionID.value;
      const newQuery = { ...route.query, id: transactionID.value };
      useRouter().replace({ query: newQuery });
    } else {
      $notify('Hiba történt a tranzakció létrehozásakor!', 'error');
      console.error('Hiba történt a tranzakció létrehozásakor! Mivel nincs Data!');
    }

  loading.value = false;
  }
};


const { $notify } = useNuxtApp();


const handleUpdate = () => {
  if (transaction.value.type == 1) {
    projectedOutgoing.value = actualOutgoing.value;
    projectedBalance.value = actualBalance.value;
    if (transaction.value.amount == 0) {
      projectedIncoming.value = actualIncoming.value;
      projectedBalance.value = actualBalance.value;
    }
    projectedIncoming.value = actualIncoming.value + (transaction.value.amount || 0);
    projectedBalance.value = actualBalance.value + (transaction.value.amount || 0);
  } else if (transaction.value.type == 2) {
    projectedIncoming.value = actualIncoming.value;
    projectedBalance.value = actualBalance.value;
    if (transaction.value.amount == 0) {
      projectedOutgoing.value = actualOutgoing.value;
      projectedBalance.value = actualBalance.value;
    }
    projectedOutgoing.value = actualOutgoing.value +  (transaction.value.amount || 0);
    projectedBalance.value = actualBalance.value - (transaction.value.amount || 0);
  }

  updateChart();
};


function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    transaction.value.picture = files[0];
  }
}

type transaction = {
  id: string | undefined;
  name: string | undefined;
  type: number | undefined;
  amount: number | undefined;
  date: Date | undefined;
  description: string | undefined;
  picture: File | undefined;
  category: string | undefined;
  userId: string;
}

const transaction = ref<transaction>({
  id: useRoute().query.id?.toString(),
  name: undefined,
  type: 0,
  amount: undefined,
  date: undefined,
  description: undefined,
  picture: undefined,
  category: '',
  userId: currentUser.user.value.uuid || ''
});




const genTransactionID = () => {
  const date = new Date();
  const formattedDate = date
    .toLocaleString('en-US', {
      month: 'numeric',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })
    .replaceAll('/', '')
    .replaceAll(',', '')
    .replaceAll(' ', '')
    .replaceAll(':', '');
  const id = formattedDate + Math.floor(10000 + Math.random() * 90000);
  transactionID.value = id;
  return 0;
};

onMounted(() => {
  updateChart();
});




</script>

<style scoped>


.mainContainer {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 85% !important;
  padding: 2vh;
  gap: 2rem;
  overflow-y: auto; /* Added vertical scrolling */
  overflow-x: hidden; /* Prevent horizontal overflow */
  padding: 1rem; /* Added padding to prevent content cutoff */
}

.chartContainer {
  width: 50% !important; /* Fixed width to 80% */
  max-width: 80%; /* Ensures it doesn't exceed 80% */
  height: auto;
  position: relative;
  margin: 0 auto; /* Center the chart horizontally */
  border: 2px solid #000;
}

/* General form container styling */
.CreateTransactionContainer {
  width: 40%;
  max-width: 500px;
  height: auto;
  padding: 2rem;
  background-color: #505050;
  border: solid 2px #000;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: #000 3px 3px 12px 1px;
  gap: 1.5rem;
  margin-top: 20vh;
}

/* Title styling */
.formTitle {
  font-family: 'Fira Sans', sans-serif;
  font-size: 1.8rem;
  color: #eeeeee;
  text-align: center;
  font-weight: 700;
  text-shadow: 2px 2px #000;
  margin-bottom: 1rem;
}

/* Label styling */
.transactionLabel {
  font-family: 'Fira Sans', sans-serif;
  font-size: 1rem;
  color: #eeeeee;
  text-align: left;
  width: 100%;
  font-weight: 600;
  text-shadow: 1px 1px #000;
}

/* Input and select styling */
input, select, button {
  width: 100%;
  height: 2.5rem;
  background-color: #2c2c2c;
  border: solid 2px #000;
  border-radius: 10px;
  color: #ffffff;
  font-family: 'Fira Sans', sans-serif;
  font-size: 1rem;
  text-align: start;
  font-weight: 600;
  text-shadow: 2px 2px #000;
  padding: 0.5rem;
}

input::placeholder {
  color: #b4b4b4;
  font-family: 'Fira Sans', sans-serif;
  font-size: 0.9rem;
  text-align: start;
  font-weight: 600;
  text-shadow: 2px 2px #000;
}

/* Submit button styling */
.submitButton {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3c3c3c;
  color: #ffffff;
  border: solid 2px #000;
  border-radius: 10px;
  font-family: 'Fira Sans', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-shadow: 2px 2px #000;
  transition: background-color 0.3s ease;
}

.submitButton:hover {
  background-color: #4c4c4c;
}

/* Responsive design for smaller screens */

@media screen and (max-width: 1600px) {
  .mainContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Adjusted to prevent cutoff */
    overflow-y: auto; /* Ensure scrolling works */
    padding: 1rem; /* Added padding for better spacing */
  }
  .CreateTransactionContainer {
    width: 90%;
    padding: 1.5rem;
    margin-top: 0; /* Adjusted for smaller screens */
  }
}

@media screen and (max-width: 768px) {
  .mainContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: scroll; /* Ensure vertical scrolling works */
    overflow-x: hidden; /* Prevent horizontal overflow */
    padding: 1rem; /* Maintain spacing */
  }

  .CreateTransactionContainer {
    width: 90%;
    padding: 1.5rem;
    margin-top: 0; /* Adjusted for smaller screens */
  }

  .formTitle {
    font-size: 1.5rem;
  }

  input, select, button {
    height: 2.2rem;
    font-size: 0.9rem;
  }

  .chartContainer {
    width: 100%; /* Allow chart to fit within the screen */
    max-width: 100%;
    height: auto; /* Adjust height for smaller screens */
  }
}
</style>