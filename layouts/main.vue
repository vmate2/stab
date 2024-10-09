<template>
  <div>
    <nav class="navbar">
      <div class="navcontainer">
        <NuxtLink to="/"><img src="public/img/logo.jpeg" alt="logo" class="logo"></NuxtLink>
        <NuxtLink to="/rolunk" class="navBarItem">Rólunk</NuxtLink>
        <div class="rightItem">
          <NuxtLink to="/login" class="navBarItem">Bejelentkezés</NuxtLink>
        </div>
      </div>
    </nav>
    <slot />
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
  body {
    background-color: #4b4b4b;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 700;
  }
</style>

<style scoped>



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
  height: fit-content ;
  max-height: 150px;
  background-color: #2e2e2e;
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
}

.logo {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 100px;
}

.navBarItem {
  color: black;
  text-decoration: none;
  font-size: 1.2rem;
  text-shadow: #4b4b4b 1px 1px;
}

.navBarItem:hover {
  color: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rightItem {
  display: flex;
  align-items: end;
  justify-content: end;
  padding-right: 50px;
}


</style>