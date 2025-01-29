<template>
  <div class="navContainer">
    Üzenőfal
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
:root {
  --text-primary-color: #e9e9e9;
  --text-secondary-color: #2ecc71;
  --font-size: 16px;
  --border: 2px solid white;
  --border-radius-outer: 12px;
  --border-radius-inner: 10px;
  --background-primary-color: #333333;
  --background-secondary-color: #AAAAAA;
  --padding-basic: 6px;
  --primary-font: "Poppins", serif;
}

* {
  user-select: none;
}

  .navContainer {
    color: var(--text-primary-color);
    background-color: var(--background-primary-color);
    width: 15vw;
    height: 40vh;
    min-width: fit-content;
    max-width: 20vw;
    min-height: fit-content;
    max-height: 60vh;
    border: var(--border);
    border-radius: var(--border-radius-outer);
    padding: var(--padding-basic);
    font-family: var(--primary-font);
    font-size: 1.3em;
    }

    body {
      background-color: rgb(48, 48, 48);
    }
</style>