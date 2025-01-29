<template>
  <div>
    <div class="frame" @click="turnOffDropDown()">
      <div class="title">Új tranzakció</div>
      <div class="lblcont">
        <div>Tranzakció típusa:</div>
      </div>
      <div class="dropdown">
        <input
          type="text"
          class="dropdown-input"
          placeholder="Válassz egy opciót..."
          readonly
          :value="selectedOption"
          @click.stop="toggleDropdown"
        />
        <ul class="dropdown-menu" :class="{ show: isOpen }">
          <li
            v-for="option in options"
            :key="option"
            class="dropdown-item"
            @click.stop="selectOption(option)"
          >
            {{ option }}
          </li>
        </ul>
      </div>
      <div class="lblcont">
        <div>Tranzakció címe:</div>
      </div>
      <input type="text" placeholder="pl: sátorvásárlás" v-model="transactionTitle">
      <div class="lblcont">
        <div>Tranzakció összege:</div>
      </div>
      <input type="number" placeholder="pl: 40000" @change="updatevalues()" v-model="osszeg" max="1000000" min="0" maxlength="7">
      <div class="lblcont">
        <div>Megjegyzés:</div>
      </div>
      <input type="text" placeholder="..." v-model="comment">
      <div class="lblcont">
        <div>Kategória:</div>
        <select v-if="transactionType == undefined" v-model="category">
          <option value="" disabled selected>Válassz típust!</option>
        </select>
        <select v-if="transactionType === 1" v-model="category">
          <option value="" disabled selected>Válassz kategóriát!</option>
          <option value="1">Szponzor</option>
          <option value="2">Egyéb</option>
        </select>
        <select v-if="transactionType === 2" v-model="category">
          <option value="" disabled selected>Válassz kategóriát!</option>
          <option value="1">Díszlet</option>
          <option value="2">Étel/Ital</option>
          <option value="3">Póló/Pulcsi</option>
          <option value="4">Tartozás</option>
          <option value="5">Egyéb</option>
        </select>
      </div>
      <button @click="createTransaction()" class="submit">Tranzakció létrehozása</button>
    </div>
    <div class="analiticsFrame">
      <div class="felirat">Analitika</div>
      <canvas id="barChart"></canvas>
      <div class="stabcashCont">
        <div>Jelenlegi stábpénz:</div>
        <div>Tranzakció utáni stábpénz:</div>
      </div>
      <div class="stabcashCont">
        <div>{{ currentStabCash + 'Ft' }}</div>
        <div :style="{ color: isLower === true ? 'red' : (isLower === false ? 'green' : 'black') }">{{ changedStabCash + ' Ft' }}</div>
      </div>
      <div class="stabcashCont" v-if="isLower != undefined">
        <div>{{ percentage + '%' }}</div>
      </div>
    </div>
    <NuxtLink to="../" class="back">Vissza az előző oldalra</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title } from 'chart.js';
import { markRaw } from 'vue';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title);

const options = ref(['Bevétel', 'Költés']);
const isOpen = ref(false);
const selectedOption = ref('');
const transactionTitle = ref();
const comment = ref('');
const currentStabCash = ref(10000);
const changedStabCash = ref(currentStabCash.value);
const currKoltes = ref(100000);
const currBevetel = ref(10000);
const projKoltes = ref(currKoltes.value);
const projBevetel = ref(currBevetel.value);
const percentage = ref();
const isLower = ref();
const transactionType = ref();
const osszeg = ref();
const category = ref();
const ctx = ref();
let chart = ref();

const updatevalues = () => {
  projBevetel.value = currBevetel.value;
  projKoltes.value = currKoltes.value;
  if (transactionType.value === 2 && osszeg.value) {
    changedStabCash.value = currentStabCash.value - osszeg.value;
    projKoltes.value = currKoltes.value + osszeg.value;
    isLower.value = true;
    calcPercentage();
  } else if (transactionType.value === 1 && osszeg.value) {
    changedStabCash.value = currentStabCash.value + osszeg.value;
    projBevetel.value = currBevetel.value + osszeg.value;
    isLower.value = false;
    calcPercentage();
  } else {
    category.value = undefined;
  }
  if (chart.value) {
    const newData = [projKoltes.value, projBevetel.value];
    chart.value.data.datasets[0].data = newData;
    chart.value.update();
  }
};

const createTransaction = () => {
  if (transactionType.value && transactionTitle.value && osszeg.value && category.value) {
    const data = {
      transType: transactionType.value,
      transTitle: transactionTitle.value,
      osszeg: osszeg.value,
      category: category.value,
      comment: comment.value || undefined
    };
    console.log(data);
  } else {
    alert('Tölts ki minden kötelező mezőt!');
  }
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const turnOffDropDown = () => {
  isOpen.value = false;
};

const selectOption = (option: string) => {
  selectedOption.value = option;
  isOpen.value = false;
  transactionType.value = selectedOption.value === 'Költés' ? 2 : 1;
  updatevalues();
};

const calcPercentage = () => {
  const difference = (((changedStabCash.value - currentStabCash.value) / currentStabCash.value) * 100).toFixed(2);
  percentage.value = difference;
};

onMounted(() => {
  ctx.value = document.getElementById('barChart') as HTMLCanvasElement;
  chart.value = markRaw(new Chart(ctx.value, {
    type: 'bar',
    data: {
      labels: ['Költés', 'Bevétel'],
      datasets: [
        {
          label: 'Pénzügy',
          data: [projKoltes.value, projBevetel.value],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            color: 'black',
          },
        },
        y: {
          ticks: {
            color: 'black',
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: 'black',
          },
        },
      },
    },
  }));
});
</script>

<style>
/* General Styles */
body {
  overflow: hidden;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

.title {
  font-family: 'Courier New', Courier, monospace;
  font-size: 180%;
  font-weight: 800;
  user-select: none;
  text-align: center;
  text-shadow: 0.05rem 0.05rem black;
  margin-bottom: 20px;
}

.frame {
  width: 30%;
  height: 85%;
  position: absolute;
  display: flex;
  border: 2px solid rgb(245, 245, 220);
  border-radius: 10px;
  padding: 15px;
  left: 3%;
  top: 5%;
  background-color: rgb(78, 78, 78);
  box-shadow: 10px 10px 30px 10px rgba(0, 0, 0, 0.685);
  flex-direction: column;
  align-items: center;
}

input {
  width: 80%;
  height: 5%;
  border-radius: 10px;
  border: none;
  margin-bottom: 15px;
  padding: 0 10px;
}

.lblcont {
  display: flex;
  justify-content: start;
  align-items: start;
  width: 80%;
  font-family: 'Courier New', Courier, monospace;
  margin-top: 10px;
  user-select: none;
  text-decoration: underline;
}

.dropdown {
  position: relative;
  width: 84%;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}


.dropdown-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  user-select: none;
  height: 40px;
  font-family: 'Courier New', Courier, monospace;
  font-size: larger;
  font-weight: 700;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  display: none;
  color: black;
  width: 100%;
  list-style-type: none;
  padding: 5px 5px;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.submit {
  width: 45%;
  height: 6%;
  border-radius: 12px;
  border: none;
  background-color: grey;
  cursor: pointer;
  margin-top: 20px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 700;
}

.analiticsFrame {
  width: 40vw;
  height: 50vh;
  position: absolute;
  background-color: cadetblue;
  left: 40vw;
  top: 10vh;
  display: flex;
  border: 2px solid rgb(245, 245, 220);
  border-radius: 10px;
  padding: 15px;
  background-color: #4e4e4e;
  box-shadow: 10px 10px 30px 10px rgba(0, 0, 0, 0.685);
  flex-direction: column;
  align-items: center;
}

.felirat {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 700;
  user-select: none;
  font-size: 200%;
  text-shadow: 0.05rem 0.05rem black;
  margin-bottom: 20px;
}

#barChart {
  width: 80% !important;
  height: 50% !important;
}

.stabcashCont {
  width: 100%;
  user-select: none;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 700;
  display: flex;
  justify-content: space-around;
  text-shadow: 0.05rem 0.05rem black;
  margin-top: 10px;
}

.back {
  position: absolute;
  right: 15px;
  top: 10px;
  font-weight: 700;
  font-size: larger;
  user-select: none;
  text-shadow: 2px 2px black;
  text-decoration: none;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .frame {
    width: 90%;
    height: auto;
    position: relative;
    margin: 20px auto;
    top: 0;
    left: 0;
  }

  .analiticsFrame {
    width: 90%;
    height: auto;
    position: relative;
    margin: 20px auto;
    top: 0;
    left: 0;
  }

  .title, .felirat {
    font-size: 150%;
  }

  input, .dropdown-input, .submit {
    height: 35px;
    font-size: 14px;
  }

  .submit {
    width: 100%;
    margin-top: 15px;
  }

  #barChart {
    height: 150px !important;
  }
}
</style>