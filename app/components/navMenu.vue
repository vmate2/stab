<template>
    <div class="hamburger" @click="toggleSideMenu()">
      <div></div>
      <div></div>
      <div></div>
    </div>
  <div class="navContainer" :class="{ active: isSideMenuOpen }">
    <slot/>
  </div>
</template>

<script lang="ts" setup>
const isSideMenuOpen = ref(false);              //
;                                               //
const toggleSideMenu = () => {                  //  Hambuger menu logic
  isSideMenuOpen.value = !isSideMenuOpen.value; //
};                                              //




</script>

<style>

.activebtn {
  color: rgb(14, 14, 206);
  transform: scaleX(1);
  transform-origin: left;
}

.navContainer {
  color: var(--text-primary-color);
  background-color: var(--background-primary-color);
  width: fit-content;
  height: 40vh;
  min-width: fit-content;
  max-width: 220px;
  min-height: fit-content;
  max-height: 60vh;
  height: fit-content;
  border: var(--border);
  border-radius: var(--border-radius-outer);
  padding: var(--padding-basic);
  font-family: var(--primary-font);
  font-weight: var(--font-weight);
  font-size: 1.3em;
  position: relative;
  top: 10px;
  left: 10px;
  box-shadow: rgba(20, 20, 20, 0.4) 2px 2px 5px 5px;
  transition: all 0.5s;
  display: flex;
  flex-direction: column;
}

.navContainer > :last-child {
  margin-bottom: 10px;
}



.buttonCont {
  transition: ease 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: nowrap;
  width: fit-content;
  margin-right: 10px;
  margin-top: 10px;
  font-size: 1.1em;
  transition: all 0.3s;
  white-space: nowrap;
}

.buttonCont:hover {
  color: rgb(182, 182, 182);
  stroke: rgb(182, 182, 182);
}

.buttonCont:active {
  scale: 0.95;
  color: rgb(182, 233, 253);
  stroke: rgb(182, 233, 253);
}


.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  cursor: pointer;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1001;
}
.hamburger div {
  width: 100%;
  height: 3px;
  background-color: white;
}

@media (max-width: 768px) { /* Nav optimization on small screens */
  .hamburger {
    display: flex;
  }

  .navContainer {
    left: -300px;
    top: 50px;
  }

  .active {
    left: 0px;
  }

  .main {
    margin-left: 0;
  }
}


</style>
