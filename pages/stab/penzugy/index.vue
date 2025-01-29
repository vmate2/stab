<template>
  <div>
    <div class="penzugyContainer">
      <NuxtLink :to="{ path: 'penzugy/new-transaction', query: { id: transactionID } }" class="selectable" style="background-image: url('/img/transaction.jpg');" @mouseover="genTransactionID">
        Új tranzakció
      </NuxtLink>
      <NuxtLink to="penzugy/analizacio" class="selectable" style="background-image: url('/img/stock.jpg');">
        Analízis
      </NuxtLink>
      <NuxtLink to="penzugy/transactionList" class="selectable" style="background-image: url('/img/clipboard.png');">
        Összes tranzakció
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'stab',
  middleware: 'auth',
});

const transactionID = ref('undefined');

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

.penzugyContainer {
  width: 90%;
  height: 80vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5vw;
}

.selectable {
  width: 18%;
  height: 25%;
  background-color: cadetblue;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
  transition: all 0.4s;
  font-size: 200%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid black;
  background-blend-mode: multiply;
  font-weight: 500;
  text-shadow: 2px 2px black;
  color: white !important; /* Ensure text is readable on the background */
}

.selectable:hover {
  width: 22%;
  height: 30%;
  font-size: 230%;
  box-shadow: rgba(1, 1, 248, 0.4) 0 0 50px 15px;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .penzugyContainer {
    flex-direction: column; /* Stack items vertically on mobile */
    gap: 5vh; /* Increase gap for better spacing */
    height: auto; /* Allow container to grow with content */
    padding: 20px 0; /* Add padding for better spacing */
  }

  .selectable {
    width: 80%; /* Full width for mobile */
    height: 20vh; /* Fixed height for better touch interaction */
    font-size: 150%; /* Smaller font size for mobile */
    margin: 10px 0; /* Add margin between items */
  }

  .selectable:hover {
    width: 80%; /* Disable hover effects on mobile */
    height: 20vh;
    font-size: 150%;
    box-shadow: none;
  }
}
</style>