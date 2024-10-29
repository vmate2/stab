<template>
    <title>Stáb - {{ trimmedpath || 'Főoldal'}}</title>
  <div>
    <nav class="navbar">
      <div class="navcontainer">
        <div class="leftItem">
          <NuxtLink to="/" class="navBarItem">
            <img src="public/img/logo.jpeg" alt="logo" class="logo">
            <div style="margin-left: 10px;">Főoldal</div>
          </NuxtLink>
        </div>
        <div class="navBarItem">
          <NuxtLink to="/rolunk" class="hov">Rólunk</NuxtLink>
        </div>
        <div class="navBarItem">
          <NuxtLink to="/programok" class="hov">Programok</NuxtLink>
        </div>
        <div class="navBarItem">
          <NuxtLink to="/jelentkezes" class="hov">Jelentkezés</NuxtLink>
        </div>
        <div class="rightItem">
          <div class="navBarItem">
            <NuxtLink to="/login" class="hov">Bejelentkezés</NuxtLink>
          </div>
        </div>
      </div>
    </nav>
    <nav class="navList">
      <div :class="['listCont', { expanded: isExpanded }]">
        <div :class="['listIcon', { 'icon-expanded': isExpanded }]" @click="expandList()" >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </div>
      <div class="navListItem"><NuxtLink to="/">Főoldal</NuxtLink></div>
      <div class="navListItem"><NuxtLink to="/rolunk">Rólunk</NuxtLink></div>
      <div class="navListItem"><NuxtLink to="/programok">Programok</NuxtLink></div>
      <div class="navListItem"><NuxtLink to="/jelentkezes">Jelentkezés</NuxtLink></div>
      <div class="navListItem navListLastItem"><NuxtLink to="/login">Bejelentkezés</NuxtLink></div>
      </div>
    </nav>
    <div class="mainCont">
      <slot />
    </div>
    <footer class="scrolling-footer">
      <div class="footer-content">
        <p><a href="mailto:trefortstab@gmail.com" class="link">trefortstab@gmail.com</a></p>
        <p>&copy; 2024 Trefortstáb </p>
        <p>Oldalt készítette: Varga Máté</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';



const route = useRoute();
const path = route.fullPath;
let trimmedpath = path.replace('/', '');
const isExpanded = ref(false);

watch(
  () => route.fullPath,
  (newPath) => {
    trimmedpath = newPath.replace('/', '');
  }
);

const expandList = () => {
  isExpanded.value = !isExpanded.value;
};

</script>

<style>

.navListItem {
  text-align: center;
  font-size: 1.2rem;
  text-shadow: #4b4b4b 1px 1px !important;
  margin: 30px 0px;
}

.navListLastItem {
  margin-top: 250px;
}

.listCont.expanded {
  left: 0px; /* Move into view when expanded */
}

.listIcon.icon-expanded {
  left: 130px; /* Move into view when expanded */
}

.listCont {
  width: 200px;
  height: 100vh;
  background-color: rgba(46, 46, 46, 1);
  position: fixed;
  top: 0;
  left: -200px;
  margin: 0;
  transition: all 0.7s ease-out;
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
}

.listIcon {
  top: 0px;
  width: 50px;
  cursor: pointer;
  margin-left: 10px;
  margin-top: 10px;
  position: absolute;
  left: 200px;
  transition: all 0.1s;
  height: 50px;
}

.hov:hover {
  color: #e8e8e8 !important;
}

a:-webkit-any-link {
    color: black;
    cursor: pointer;
    text-decoration: none;
}

  body {
    background-color: rgb(75, 75, 75);
    overflow-x: hidden;
    overflow-y: auto;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 700;
    margin: 0;
    padding: 0;
  }

  footer {
    position: relative;
    bottom: -20vh;
    left: 0;
    width: 100%;
    min-height: 300px;
    background-color: #2e2e2e;
    overflow: hidden;
    display: flex;
    justify-content: center; 
    align-items: center;
    color: white;
    font-size: 1.2rem;
  }

  .footer-content {
    text-align: center;
  }


  .mainCont {
    justify-content: center;
    align-items: center;
    display: flex;
    min-height: 100vh;
    height: fit-content;
    position: relative;
    top: 20vh;
  }

</style>

<style scoped>

  .navList {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
  }

  .link {
    color: wheat;
    cursor: pointer;
    text-decoration: underline;
  }

  .navbar {
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .navcontainer {
    width: 100%;
    min-height: 100px;
    height: fit-content;
    max-height: 150px;
    background-color: #2e2e2e;
    display: grid;
    justify-content: center;
    grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
    align-items: center;
  }

  .logo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    cursor: pointer;
  }

  .navBarItem {
    color: black;
    text-decoration: none !important;
    font-size: 1.2rem !important;
    text-shadow: #4b4b4b 1px 1px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
  }

  .navBarItem:hover {
    color: #e8e8e8 !important;
  }

  .rightItem {
    display: flex;
    align-items: end !important;
    justify-content: end !important;
    padding-right: 50px;
  }

  .leftItem {
    display: flex;
    align-items: start !important;
    justify-content: start !important;
    padding-left: 50px;
  }

  @media (min-width: 768px) {
    .navbar {
      display: block;
    }
    .navList {
      display: none;
    }
  }

  @media (max-width: 767px) {
    .navbar {
      display: none;
    }
    .navList {
      display: block;
    }
  }
</style>
