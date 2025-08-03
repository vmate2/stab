<template>
  <title>{{ trimmedpath || "Főoldal" }}</title>
  <div class="body2">
    <nav class="nav" :class="{'hiddenNav': isNavHidden}">
      <svg @click="isNavHidden = !isNavHidden" :class="{'hiddenClose': isNavHidden}" class="openClose" fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-10 -10 120.00 120.00" enable-background="new 0 0 100 100" xml:space="preserve" transform="matrix(1, 0, 0, -1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="4.4"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.563,30.277h0.012c0,1.245,1.004,2.254,2.246,2.267v0.002h60.359v-0.001c1.248-0.006,2.259-1.018,2.259-2.268h0.01 l0-10.459h0c-0.002-1.251-1.017-2.265-2.269-2.265l0,0H19.821v0c0,0,0,0,0,0c-1.253,0-2.269,1.017-2.269,2.269 c0,0.039,0.01,0.076,0.012,0.115L17.563,30.277z"></path> <path d="M80.179,42.504L80.179,42.504H19.821v0c0,0,0,0,0,0c-1.253,0-2.269,1.017-2.269,2.269c0,0.039,0.01,0.076,0.012,0.115 l0,10.34h0.012c0,1.245,1.004,2.254,2.246,2.267v0.002h60.359v-0.001c1.248-0.006,2.259-1.018,2.259-2.268h0.01l0-10.459h0 C82.446,43.518,81.431,42.504,80.179,42.504z"></path> <path d="M80.179,67.454L80.179,67.454H19.821l0,0c0,0,0,0,0,0c-1.253,0-2.269,1.017-2.269,2.269c0,0.039,0.01,0.076,0.012,0.115 l0,10.34h0.012c0,1.245,1.004,2.254,2.246,2.267v0.002h60.359v-0.001c1.248-0.006,2.259-1.019,2.259-2.269h0.01l0-10.459h0 C82.446,68.468,81.431,67.454,80.179,67.454z"></path> </g> </g></svg>
      <nuxt-link to="/" class="navBarLogo link">
        <img class="navBarLogo" src="public/img/stablogo.jpg" alt="logo">
      </nuxt-link>
      <nuxt-link class="link" to="/rolunk" :class="{'activeLink': useRoute().path === '/rolunk' || useRoute().path === '/rolunk/' }">Rólunk</nuxt-link>
      <nuxt-link class="link" to="/programok" :class="{'activeLink': useRoute().path === '/programok' || useRoute().path === '/programom/' }" >Programok</nuxt-link>
      <nuxt-link class="link" to="/jelentkezes" :class="{'activeLink': useRoute().path === '/jelentkezes' || useRoute().path === '/jelentkezes/' }" >Jelentkezés</nuxt-link>
      <nuxt-link class="link rightAlign" to="/login" :class="{'activeLink': useRoute().path === '/login' || useRoute().path === '/login/' }" >Bejelentkezés</nuxt-link>
      <div class="closeBtn">X</div>
    </nav>
    <div class="mainFrame">
      <NuxtPage />
    </div>
    <footer>
      <div>FinalDeal 2025</div>
      <div>Trefort Ágoston Technikum, Szakképző Iskola és Kollégium</div>
      <a href="mailto:trefortstab@gmail.com" target="_blank" noreferrer>trefortstab@gmail.com</a> <!-- Added mailto link -->
    </footer>
    <Notification />
    <div class="hideNav" @click="isNavHidden = true" :class="{'hiddenNav': isNavHidden}"></div>
  </div>
</template>


<script lang="ts" setup>
const route = useRoute();
let trimmedpath = useRoute().fullPath.replace('/', '');

const {$notify, $showDialog} = useNuxtApp();



watch(
  () => route.fullPath,
  (newPath) => {
    trimmedpath = newPath.replaceAll('/', '');
  },
  { immediate: true }
);

const isNavHidden = ref(true);
</script>

<style>
.nav {
  background-color: transparent;
  color: white;
  padding: 10px;
  text-align: center;
  position: relative;
  top: 0;
  left: 0;
  width: 100dvw;
  min-height: 10dvh;
  height: fit-content;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr 3fr;
  transition: all 0.3s;
}

.openClose {
  display: none;
  cursor: pointer;
}



footer {
  background: linear-gradient( var(--background-trietary-color), #8B0000); /* Dark red tone */
  width: 100vw;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: large;
  user-select: text;
  gap: 20px;
  color: var(--text-secondary-color);
}

.mainFrame {
  position: relative;
  width: 100vw;
  height: fit-content;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.navBarLogo {
  width: 100px;
  height: 100px;
  border-radius: 20%;
}

.body2 {
  overflow-x: hidden;
  background-color: var(--background-trietary-color);
  height: 100dvh;
  width: 100dvw;
  overflow-y: scroll; /* Enable vertical scrolling */
}

.body2::-webkit-scrollbar {
  width: 12px; /* Width of the scrollbar */
}

.body2::-webkit-scrollbar-track {
  background: var(--background-trietary-color); /* Background of the scrollbar track */
}

.body2::-webkit-scrollbar-thumb {
  background-color: #8B0000; /* Color of the scrollbar thumb */
  border-radius: 10px; /* Roundness of the scrollbar thumb */
  border: 3px solid var(--background-trietary-color); /* Padding around the scrollbar thumb */
  cursor:n-resize;
}

.link {
  color: var(--text-primary-color);
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
  color: #ffcc00;
}

.link:active {
  color: #c09a00;
  transform: perspective(120px) scale(0.95);
}

.rightAlign {
  justify-self: end; /* Align the last nav button to the right */
  margin-right: 10%;
}

.activeLink {
  color: #c09a00;
}

.closeBtn {
  display: none;
}

.hideNav {
  display: none;
}

footer > div {
  text-align: center;
}

@media (max-width: 600px) {
  .nav {
    background-color: #8B0000; /* Dark red tone */
    padding: 10px;
    text-align: center;
    position: fixed;
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
    z-index: 100;
    transition: all 0.3s;
  }

  .hideNav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
    display: block;
  }

  footer {
    word-wrap: normal;
    text-wrap: justify;
  }

  .mainFrame {
    position: relative;
    top: 0;
    left: 0;
  }

  .rightAlign {
    align-self: end; /* Align the login button at the bottom */
    margin-bottom: 20px;
  }

  .openClose {
    display: block;
    position: fixed; 
    width: 50px;
    height: 50px; 
    top: 10px;
    left: 170px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .hiddenNav {
  transform: translateX(-100%);
}

.hiddenClose {
  display: block;
  position: absolute;
  top: 10px;
  left: 230px;
  cursor: pointer;
}

}
</style>