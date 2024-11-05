<template>
  <div>
    <div class="container">
      <div class="row0">
        <div class="profilecont"></div>
      </div>
      <div class="row1">
        <div class="profilecont"></div>
        <div class="profilecont"></div>
      </div>
      <div class="row2">
        <div class="profilecont"></div>
        <div class="profilecont"></div>
      </div>
    </div>
    <div class="container">
      <div class="leirasCont">
        <div></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
layout: 'main'
});
</script>

<style>
  .leirasCont {
    background-color: red;
    position: relative;
    width: 30vw;
    min-height: 30dvh;
    margin-bottom: 20vh;
  }

  body {
    overflow-x: hidden;
  }

  .container {
    width: 100vw;
    min-height: 100vh;
    height: fit-content;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  body {
    overflow-x: hidden;
  }
  .row0 {
    width: 100vw;
    height: 0;
    display: flex;
    justify-content: center;
    position: relative;
    gap: 20vw;
  }

  .profilecont {
    min-width: 100px;
    min-height: 100px;
    max-height: 200px;
    max-width: 200px;
    height: 20vw;
    width: auto;
    background-color: red;
    aspect-ratio: 1/1;
    border-radius: 15px;
    padding: 15px;
    position: relative;
  }
  .row1 {
    width: 100vw;
    height: 0;
    display: flex;
    justify-content: center;
    position: relative;
    gap: 20vw;
  }
  .row2 {
    width: 100vw;
    height: 0;
    display: flex;
    justify-content: center;
    position: relative;
    gap: 40vw;
  }
</style>