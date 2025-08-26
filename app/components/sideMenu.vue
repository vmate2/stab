<template>
  <div class="menuBackground">
    <nuxt-link to="/kaszino/games/plinko">Plinko</nuxt-link>
    <nuxt-link to="/kaszino/games/plinko">Plinko</nuxt-link>
    <nuxt-link to="/kaszino/games/plinko">Plinko</nuxt-link>
    <nuxt-link to="/kaszino/games/plinko">Plinko</nuxt-link>
    <nuxt-link to="/kaszino/games/plinko">Plinko</nuxt-link>
    <nuxt-link to="/kaszino/games/plinko">Plinko</nuxt-link>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>

.menuBackground {
  background-color: rgb(39, 39, 39);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.menuBackground > a {
  width: auto;
  height: auto;
  font-size: 2rem;
  color: white;
}

</style>