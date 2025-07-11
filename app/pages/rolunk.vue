<template>
  <div>
    <div class="container">
      <div class="row0" v-show="displayRow0" ref="row0">
        <div class="profilecont" @click="renderLore(1)">
          <div class="text">Madai István Richárd</div>
          <img src="public/img/pityu.jpg" alt="Madai István Richárd" class="image">
          <div class="text">Jelölt</div>
        </div>
      </div>
      <div class="row1" v-show="displayRow1" ref="row1">
        <div class="profilecont" @click="renderLore(2)">
          <div class="text">Nagy Panka Julianna</div>
          <img src="public/img/pityu.jpg" alt="Madai István Richárd" class="image">
          <div class="text">Kampányfőnök</div>
        </div>
        <div class="profilecont" @click="renderLore(3)">
          <div class="text">Chovan Natália</div>
          <img src="public/img/pityu.jpg" alt="Madai István Richárd" class="image">
          <div class="text">Kampényfőnök</div>
        </div>
      </div>
      <div class="row2" v-show="displayRow2" ref="row2">
        <div class="profilecont" @click="renderLore(4)">
          <div class="text">Varga Máté</div>
          <img src="public/img/pityu.jpg" alt="Madai István Richárd" class="image">
          <div class="text">Kampányfőnök</div>
        </div>
        <div class="profilecont" @click="renderLore(5)">
          <div class="text">Petrás Áron Richárd</div>
          <img src="public/img/pityu.jpg" alt="Madai István Richárd" class="image">
          <div class="text">Kampányfőnök</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="leirasCont">
        <div></div>
      </div>
    </div>
  </div>
  <div class="loreContainer blurIn" v-if="shownLore" @click="hideLore()" ref="loreContBig">
    <div class="innerLoreContainer slideIn" @click.stop ref="loreCont">
      <div v-html="lore" style="font-family: 'Montserrat', sans-serif;font-weight: 700;color: gold;"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
layout: 'main'
});

const displayRow0 = ref(false)
const displayRow1 = ref(false)
const displayRow2 = ref(false)

const shownLore = ref(false)
const loreCont = ref();
const loreContBig = ref();


onMounted(() => {
  displayRow0.value = true;

  setTimeout(() => {
    displayRow1.value = true;
  }, 500);

  setTimeout(() => {
    displayRow2.value = true
  }, 1000);
});

const lore = ref<string | undefined>('');

const lores = [
  ' <span style="width:100%; text-align:center; display:block; font-size:1.2em; font-weight:bold;">Sziasztok!</span><br>Én <strong>Madai István Richárd</strong> vagyok, 18 éves, Mezőkovácsházán születtem, és jelenleg a Trefort Ágoston Technikumban tanulok az <strong>Erősáramú elektrotechnikus</strong> szakon, a 12/C osztályban.<br><br>Szenvedélyem a szakmám — szeretek villanyt szerelni és gyakran segítek másoknak is ezzel kapcsolatban. Fontos számomra a közösség, az emberek, és aktívan részt is veszek a diákéletben.<br><br>Jelenleg a <strong>városi diákönkormányzat tagja</strong> vagyok, az <strong>iskolai DÖK alelnöki</strong> tisztséget töltöm be, és <strong>iskolánk nagyköveteként</strong> képviselem a BSZC-t is.<br><br><span style="display:block; text-align:center; font-size:1.1em; font-weight:bold;">Én képviselem a Trefortot az idei, 2025-ös Garabonciás Napokon!</span> ',
  '2',
  '3',
  '4',
  '5'
]

const renderLore = (index:number) => {
  shownLore.value = true;
  lore.value = lores[index - 1];
  setTimeout(() => {
      loreCont.value?.classList.remove('slideIn')
  }, 1500);
}

const hideLore = () => {
        loreContBig.value?.classList.remove('blurIn')
  loreCont.value?.classList.add('slideOut')
  setTimeout(() => {
          loreContBig.value?.classList.add('blurOut')
  }, 100);


  setTimeout(() => {
    shownLore.value = false;
    lore.value = '';
  }, 1500);
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&display=swap');

.container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: 5vh;
  gap: 5vh;
  background-color: #8B0000; /* deep red */
  font-family: 'Cinzel', serif;
}

/* Triangle layout */
.row0, .row1, .row2 {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideIn 1s forwards ease-out;
  transition: all 3s;
}

.row0 { gap: 5vw; }
.row1 { gap: 18vw; }
.row2 { gap: 50vw; }

.profilecont {
  background: linear-gradient(145deg, rgba(0,0,0,0.8), rgba(20,20,20,0.8));
  border: 2px solid gold;
  box-shadow: 0 0 25px gold, inset 0 0 10px rgba(255,215,0,0.4);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: clamp(120px, 20vw, 220px);
  aspect-ratio: 1/1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profilecontInvis {
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: clamp(120px, 20vw, 220px);
  aspect-ratio: 1/1;
  z-index: 3;
}

.profilecontInvis:hover {
  width: 100vw;
  height: 100vh;
  background-color: red;
}


.profilecont:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 0 35px gold, inset 0 0 15px rgba(255,215,0,0.6);
}

.image {
  width: 100%;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 15px;
  margin: 12px 0;
  border: 2px solid darkgreen;
  box-shadow: 0 0 10px black;
}

.text {
  color: gold;
  font-size: clamp(1vw, 1rem, 1vw);
  text-align: center;
  text-shadow: 1px 1px 2px black;
  white-space: nowrap;
  max-width: 100%;
  transform: scaleX(0.95);
}

.text strong {
  color: gold;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.7);
  font-weight: 900;
}

/* Description block */
.leirasCont {
  background-color: rgba(0, 0, 0, 0.4);
  border: 2px solid darkgreen;
  border-radius: 15px;
  padding: 2vw;
  color: white;
  font-size: 1.2vw;
  width: clamp(250px, 30vw, 500px);
  min-height: 30dvh;
  margin-block: 5vh 20vh;
  box-shadow: 0 0 15px black;
}

/* Mobile responsive column */
@media screen and (max-width: 500px) {
  .row0, .row1, .row2 {
    flex-direction: column;
    align-items: center;
    gap: 4vh;
  }

  .container {
    padding-block: 2vh;
    gap: 4vh;
  }


  .leirasCont {
    width: 85vw;
    font-size: 4vw;
  }

  .text {
    font-size: 2.4vw !important;
  }
}

.loreContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  align-self: center;
  backdrop-filter: blur(0px);
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blurIn {
  animation: blurIn 1s forwards;
}

.blurOut {
    animation: blurIn 1s backwards;
}

.innerLoreContainer {
  width: clamp(300px, 35vw, 600px);
  max-height: 75vh;
  background: linear-gradient(145deg, rgba(0, 0, 0, 0.95), rgba(30, 30, 30, 0.95));
  border: 2px solid gold;
  border-radius: 20px;
  padding: 2vw;
  box-shadow:
    0 0 25px gold,
    inset 0 0 10px rgba(255, 215, 0, 0.3),
    0 0 10px 2px rgba(0, 0, 0, 0.7);
  color: gold;
  font-family: 'Cinzel', serif;
  font-size: clamp(14px, 1.2vw, 18px);
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  transition: all 0.3s ease;
}


.slideIn {
    animation: slideIn 1.5s forwards ease-out;
}

.slideOut {
    animation: slideOut 1.5s backwards ease-out;
}

@media screen and (max-width:1100px) {
  .text {
    font-size: 1.7vw;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10vh);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10vh);
  }

}

@keyframes blurIn {
  from {
    backdrop-filter: blur(0px);
  }
  to {
    backdrop-filter: blur(5px);
  }
}


</style>