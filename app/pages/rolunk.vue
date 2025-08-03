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
          <div class="text">Kampányfőnök</div>
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
      <div class="bemutatkozas" ref="leirascont" :class="{'slideInFromBottom': isLeirasContVisible.hasBeenVisible.value}" v-show="showOthers">
        <div v-html="leiras"></div>
      </div>
    </div>
    <div class="container" v-show="showOthers">
  <div
    class="koltsegvetes-container"
    :class="{ visible: isProgress1Visible.hasBeenVisible.value }"
    ref="progress1"
  >
  <h2 class="koltsegvetes-title">Költségvetés</h2>
  <div class="koltsegvetes-items">
    <div class="koltsegvetes-item">
      <div class="koltsegvetes-item-header">
        <span class="koltsegvetes-item-label">Kiadás</span>
        <span class="koltsegvetes-item-percentage">{{ expense }}ft</span>
      </div>
      <div class="koltsegvetes-progress-bar">
        <div
          class="koltsegvetes-progress-indicator animate"
          :style="{ '--progress-value': (expense / total * 100) + '%' }"
        ></div>
      </div>
    </div>

    <div class="koltsegvetes-item">
      <div class="koltsegvetes-item-header">
        <span class="koltsegvetes-item-label">Bevétel</span>
        <span class="koltsegvetes-item-percentage">{{ income }}ft</span>
      </div>
      <div class="koltsegvetes-progress-bar">
        <div
          class="koltsegvetes-progress-indicator animate"
          :style="{ '--progress-value': (income / total * 100) + '%' }"
        ></div>
      </div>
    </div>
  </div>
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

const displayRow0 = ref(false);
const displayRow1 = ref(false);
const displayRow2 = ref(false);

const shownLore = ref(false);
const loreCont = ref();
const loreContBig = ref();

const income = ref(0);
const expense = ref(0);
const total = ref(0);





const leirascont = ref();
const progress1 = ref()

const showOthers = ref(false);

const { data, status, error, refresh } = await useFetch('api/publicData', {
  method: 'GET',
  key: 'publicData'
});

onMounted(() => {
  refresh()
  displayRow0.value = true;

  setTimeout(() => {
    displayRow1.value = true;
  }, 500);

  setTimeout(() => {
    displayRow2.value = true
    showOthers.value = true
  }, 1000);

  console.log(data.value);
  

});

const isLeirasContVisible = useOnScreen(leirascont, {threshold: 0.45})
const isProgress1Visible = useOnScreen(progress1, {threshold: 0.45})
watch(() => isProgress1Visible.hasBeenVisible.value && data.value, (visible) => {
  
  if (visible) {
    console.log(data.value);
    
    total.value = data.value.income + data.value.expense,
    animateCounter((val) => income.value = val, data.value.income, 3000);
    animateCounter((val) => expense.value = val, data.value.expense, 3000);
    console.log(income.value, expense.value, total.value);
    
    
  }
});







const lore = ref<string | undefined>('');

const lores = [
  ' <span style="width:100%; text-align:center; display:block; font-size:1.2em; font-weight:bold;">Sziasztok!</span><br>Én <strong>Madai István Richárd</strong> vagyok, 18 éves, Mezőkovácsházán élek, és jelenleg a Trefort Ágoston Technikumban tanulok az <strong>Erősáramú elektrotechnikus</strong> szakon, a 12/C osztályban.<br><br>Szenvedélyem a szakmám — szeretek villanyt szerelni és gyakran segítek másoknak is ezzel kapcsolatban. Fontos számomra a közösség, az emberek, és aktívan részt is veszek a diákéletben.<br><br>Jelenleg a <strong>városi diákönkormányzat tagja</strong> vagyok, az <strong>iskolai DÖK alelnöki</strong> tisztséget töltöm be, és <strong>iskolánk nagyköveteként</strong> képviselem a BSZC-t is.<br><br><span style="display:block; text-align:center; font-size:1.1em; font-weight:bold;">Én képviselem a Trefortot az idei, 2025-ös Garabonciás Napokon!</span> ',
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
  }, 500);
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
  }, 500);
}
let leiras;

  leiras = computed(() => {
  return `
    <section class="bemutatkozas-box">
    <p>
      Csapatunk egy lelkes, elhivatott és kreatív fiatalokból álló közösség, akik hisznek abban, hogy a tudatos szervezés, a lendületes ötletek és az együttműködés valódi változást hozhat.
      A stábunk összesen <strong>${data.value?.stabtagCount || '?'} fővel</strong> indul neki a kampánynak, mindenki saját szakterületén aktív szerepet vállalva.
    </p>

    <h3>Szervezeti felépítésünk</h3>
    <ul>
      <li><strong>Vezetőség</strong> – koordinálja a kampány egészét, képviseli a csapatot és felel a stratégiai döntésekért.</li>
      <li><strong>Kommunikációs csoport</strong> – a vizuális megjelenésért, közösségi médiás jelenlétért és az üzenet világos átadásáért felel.</li>
      <li><strong>Projektcsapat</strong> – a gyakorlati megvalósításban, eseményszervezésben és a közösség bevonásában játszik kulcsszerepet.</li>
    </ul>

    <h3>Három fő kampánycélunk</h3>
    <ol>
      <li><strong>Közösségépítés</strong> – erős, nyitott és támogató közösséget szeretnénk formálni, ahol mindenki hangja számít.</li>
      <li><strong>Részvétel ösztönzése</strong> – minél több embert szeretnénk bevonni a programjainkba és döntéshozatali folyamatainkba.</li>
      <li><strong>Fenntarthatóság és fejlődés</strong> – hosszú távú, valódi eredményeket hozó megoldásokat keresünk.</li>
    </ol>

    <h3>Témavilágunk</h3>
    <p>
      A modern, fiatalos lendület és az értékközpontú gondolkodás találkozása. Vizuális arculatunk letisztult, dinamikus és figyelemfelkeltő,
      színeiben és üzeneteiben is a jövőt, fejlődést és nyitottságot képviseli.
    </p>

    <h3>Hogyan fogjuk meg az embereket?</h3>
    <p>
      <strong>Őszinteséggel, hitelességgel és kreatív megoldásokkal.</strong> Nem üres ígéreteket teszünk, hanem valódi lehetőségeket kínálunk a bevonódásra,
      véleménynyilvánításra és a közös építkezésre.
    </p>

    <h3>Szponzoraink</h3>
    <p>
      A kampányt jelenleg <strong>${data.value?.sponsorCount || '0'} szponzor</strong> támogatja, akik értékeinkkel és célkitűzéseinkkel egyetértve segítik a munkánkat – nemcsak anyagilag, hanem erkölcsileg is.
    </p>
  </section>
  `;
});


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&display=swap');


.container {
  width: 100vw;
  min-height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: 5vh;
  gap: 5vh;
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
  cursor: pointer;
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

.bemutatkozas .bemutatkozas-box {
  background-color: #8B0000; /* sötét piros */
  padding: 2rem;
  border-radius: 16px;
  max-width: 850px;
  margin: 2rem auto;
  color: #FFF8DC;
  font-family: 'Segoe UI', sans-serif;
  line-height: 1.6;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
  border: 2px solid #FFD700; /* arany */
   transition: color 0.3s ease, text-shadow 0.3s ease;
}

.bemutatkozas {
  background: hsl(0, 0%, 10%, 0.3);
  border: 2px solid hsl(120, 100%, 10%);
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 42rem;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  opacity: 0;
  transform: translateY(6rem);
  transition: all 0.5s ease-out;
  width: 100%;
  margin: 0 auto;
}

.bemutatkozas-box h2,
.bemutatkozas-box h3 {
  color: #FFD700;
  margin-bottom: 0.5rem;
}

.bemutatkozas .bemutatkozas-box h2 {
  font-size: 2rem;
  text-align: center;
}

.bemutatkozas-box h3 {
  font-size: 1.4rem;
  margin-top: 2rem;
}

.bemutatkozas-box p,
.bemutatkozas-box li {
  font-size: 1.05rem;
  line-height: 1.75;
  letter-spacing: 0.02em;
}

.bemutatkozas-box ul,
.bemutatkozas-box ol {
  padding-left: 1.5rem;
}

.bemutatkozas-box strong {
  color: #FFD700; /* világosabb arany */
  font-weight: 800;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.8), 0 0 10px rgba(255, 215, 0, 0.3);
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


  .bemutatkozas {
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

.koltsegvetes-container {
  background: hsl(0, 0%, 10%, 0.3);
  border: 2px solid hsl(120, 100%, 10%);
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 42rem;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  opacity: 0;
  transform: translateY(6rem);
  transition: all 0.5s ease-out;
  width: 100%;
  margin: 0 auto;
}

.koltsegvetes-container.visible {
  opacity: 1;
  transform: translateY(0);
  animation: casino-slide-in-bottom 1.6s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
}

.koltsegvetes-title {
  color: hsl(46, 100%, 60%);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Cinzel', serif;
}

.koltsegvetes-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.koltsegvetes-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.koltsegvetes-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.koltsegvetes-item-label {
  color: hsl(0, 0%, 95%);
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
}

.koltsegvetes-item-percentage {
  color: hsl(46, 100%, 60%);
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
}

.koltsegvetes-progress-bar {
  position: relative;
  height: 0.75rem;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
  background: hsl(0, 0%, 5%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.koltsegvetes-progress-indicator {
  height: 100%;
  width: 100%;
  flex: 1;
  background: hsl(46, 100%, 60%);
  transition: all 0.5s ease-out;
  border-radius: 9999px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  transform: translateX(-100%);
}

.koltsegvetes-progress-indicator.animate {
  transform: translateX(calc(-100% + var(--progress-value)));
}

@media (max-width: 768px) {
  .koltsegvetes-container {
    padding: 1.5rem;
    max-width: 90vw;
  }

  .koltsegvetes-title {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .koltsegvetes-items {
    gap: 1rem;
  }

  .koltsegvetes-item-label,
  .koltsegvetes-item-percentage {
    font-size: 0.875rem;
  }
}

@keyframes casino-slide-in-bottom {
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}



.progressTitle {
  font-size: clamp(1.2rem, 2vw, 2rem);
  color: gold;
  text-align: center;
  margin: 0;
}



.slideInFromBottom {
  opacity: 0;
  animation: slideInFromBottom 1.6s forwards cubic-bezier(0.215, 0.610, 0.355, 1);
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(10vh);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.slideIn {
    animation: slideIn .5s forwards ease-out;
}

.slideOut {
    animation: slideOut .5s backwards ease-out;
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