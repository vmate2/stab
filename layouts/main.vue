<template>
  <title>{{ trimmedpath || "Főoldal" }}</title>
    <nav>
      <nuxt-link to="/" class="navBarLogo link">
        <img class="navBarLogo" src="public/img/logo.jpeg" alt="logo">
      </nuxt-link>
      <nuxt-link class="link" to="/rolunk">Rólunk</nuxt-link>
      <nuxt-link class="link" to="/programok">Programok</nuxt-link>
      <nuxt-link class="link" to="/jelentkezes">Jelentkezés</nuxt-link>
      <nuxt-link class="link rightAlign" to="/login">Bejelentkezés</nuxt-link>
      <div class="closeBtn">X</div>
    </nav>
    <div class="mainFrame">
      <NuxtPage />
    </div>
</template>


<script lang="ts" setup>
const route = useRoute();
let trimmedpath = useRoute().fullPath.replace('/', '');

watch(
  () => route.fullPath,
  (newPath) => {
    trimmedpath = newPath.replaceAll('/', '');
  }
);
</script>

<style>
nav {
  background-color: transparent;
  color: white;
  padding: 10px;
  text-align: center;
  position: relative;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 10dvh;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr 3fr;
  transition: all 0.3s;
}

.mainFrame {
  position: relative;
  width: 100vw;
  height: fit-content;
  min-height: 90vh;
}

.navBarLogo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

body {
  overflow-x: hidden;
}

.link {
  color: white;
  text-decoration: none;
  font-size: 20px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  width: fit-content;
  height: fit-content;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffcc00;
}

.rightAlign {
  justify-self: end; /* Align the last nav button to the right */
  margin-right: 10%;
}

.closeBtn {
  display: none;
}
@media (max-width: 600px) {
  nav {
    background-color: #333;
    padding: 10px;
    text-align: center;
    position: relative;
    top: 0;
    left: 0;
    max-width: 30dvw;
    min-width: 200px;
    height: 100dvh;
    display: grid;
    align-items: center;
    justify-items: center; /* Center items on the x-axis */
    grid-template-rows: 1fr 1fr 1fr 1fr 3fr;
    grid-template-columns: 1fr;
    /*transform: translateX(-100%); */
  }

  .rightAlign {
    align-self: end; /* Align the login button at the bottom */
    margin-bottom: 20px;
  }

  .closeBtn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 30px;
    cursor: pointer;
    display: block;
  }
}
</style>