<template>
  <div class="container">
    <NuxtLink class="card" to="./garatools/qrcodereader" ref="card">QR kód olvasó</NuxtLink>
    <NuxtLink class="card" to="./garatools/locator" ref="card">Lokátor</NuxtLink>
    <NuxtLink class="card" to="./garatools/qrcodereader" ref="card">Placeholder</NuxtLink>

  </div>
</template>

<script lang="ts" setup>

const card = ref();

definePageMeta({
  layout: 'new'
});

</script> 

<style scoped>

.container {
  height: 100vh;
  width: 90%;
  justify-self: center;
  display: flex;
  flex-wrap: wrap; /* Allow wrapping */
  align-items: center;
  justify-content: center;
  overflow-x: auto; /* Allow horizontal scroll if needed */
  overflow-y: auto;
  height: 85vh;
}

.card {
  width: 300px;
  height: 150px;
  background-color: white;
  border-radius: 10px;
  transition: all 0.2s ease-in-out, font-size 0.2s ease-in-out;
  margin: 10px 10px;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: white;
  font-family: 'Poppins', sans-serif;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.781);
}

.card:hover {
  background-color: #f0f0f0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 320px;
  height: 170px;
  font-size: 1.8rem;
  /* Use width/height/font-size to push other cards */
}

.card:nth-child(1) {
  background-image: url('public/img/qrcoderead.jpg');
  background-size: cover;
  background-position: center;
}

</style>