<template>
  <div>
    <client-only>
    <wheelspin v-if="showSpin"
      @dontShow="handleDontShow"
      @win="handleWin($event)"
      :disappear="disappear"
    />
    </client-only>
  </div>
  <div v-if="!showSpin" class="container">
    <button @click="resetSpinDebug">reset spin</button>
    <div class="welcomeText">Üdvözöl a <strong>Trefort <span>FinalDeal</span></strong> stábja!</div>
    <div class="introText">A 2025-ös Békéscsabai Garabonciás napokon mi képviseljük a <span>Trefort Ágoston Technikumot</span>. <br> Szereténk az idei <span>Garán</span> felejthetetlen élményeket nyújtani számotokra! <br>Idén teljesen <span>nyílt lapokkal</span> indulunk, tehát majdnem minden adatot megtaláltok rólunk, itt a weboldalon. <br>Ha felkeltettük az érdeklődésed csekkold le a <span><NuxtLink to="/rolunk">Rólunk</NuxtLink></span> oldalt is!</div>
    <div></div>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: 'main',
  title: 'Főoldal',
  description: 'Egy csodás weboldal'
});

import wheelspin from '~/components/wheelspin.vue';
import { ref, onMounted } from 'vue';
const { $notify } = useNuxtApp();

const showSpin = ref(true);
const hasSpun = useCookie('hasSpunWheel', { maxAge: 60 * 60 * 24 }); // 24 hours
const disappear = ref(false);

// Helper for localStorage with expiry
function setWithExpiry(key: string, value: string, ttlMs: number) {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttlMs,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key: string): string | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  try {
    const item = JSON.parse(itemStr);
    if (new Date().getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
}

onMounted(() => {
  if (getWithExpiry('hasSpunWheel') === 'true' || hasSpun.value === 'true') {
    showSpin.value = false;
  }
});

function handleDontShow() {
  disappear.value = true; // Trigger the animation
  setWithExpiry('hasSpunWheel', 'true', 24 * 60 * 60 * 1000); // 24 hours
  hasSpun.value = 'true'; // Update the cookie to persist across sessions (24h)
    setTimeout(() => {
      showSpin.value = false;
  }, 2000);
}


async function handleWin(event: any) {
  console.log('win event triggered', event);

  if (!event.amount) {
    event.amount = 1; // Default to 0 if no amount is provided
  }


  const {data, status, error} = await useFetch('/api/wheelwin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Id': `${generateRequestId(event)}`,
    },
    body: event,
  });

  if (error.value) {
    console.error('Error fetching wheel win:', error.value);
    $notify('Hiba történt a nyeremény feldolgozása során.', 'error');
    return;
  }

  if (data.value && data.value.success === true) {
    log.infoPublic({
      title: 'New win',
      type: 'wheelSpin_win',
      message: 'A felhasználó nyert a keréken.',
      data: {
        requestId: data.value.requestId,
        winType: event.type,
        winAmount: event.amount || 1,
        name: event.name || 'N/A',
        email: event.email || 'N/A',
      }
    });
    $notify('Nyereményed elküldve!', 'success');
  }

}

function resetSpinDebug() {
  localStorage.removeItem('hasSpunWheel');
  hasSpun.value = null;
  showSpin.value = true;
  console.log('Spin state reset (debug)');
}

const generateRequestId = (win:any) => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:.]/g, '');
  return win.amount ? `req-${timestamp}-${win.type}-${win.amount}`: `req-${timestamp}-${win.type}-noamount`;
};



</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Orbitron:wght@600&display=swap');

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 65vh;
  padding: 2vh 4vw;
  gap: 2rem;
  text-align: center;
}

.welcomeText {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: black;
  background: linear-gradient(145deg, #b8860b, #ffd700);
  padding: 1.5rem 2.5rem;
  border-radius: 20px;
  box-shadow:
    0 0 15px rgba(255, 215, 0, 0.8),
    0 0 25px rgba(255, 0, 0, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.4);
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.7);
  transition: transform 0.3s ease;
}

.welcomeText:hover {
  transform: scale(1.03);
}

.welcomeText span {
  color: #8b0000;
  text-shadow: 1px 1px 2px #000000;
}

.introText {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  max-width: 60ch;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  line-height: 1.6;
  text-shadow: 2px 2px black;
}

.introText span {
  color: rgb(20, 107, 0);
  text-shadow: 1px 1px black;
}

.introText a {
  font-style: italic;
}




@media screen and (max-width: 600px) {
  .container {
    margin-top: 8vh;
    padding: 1rem;
    gap: 1.5rem;
  }

  .welcomeText {
    font-size: clamp(1.6rem, 6vw, 2.7rem);
    padding: 1rem 1.5rem;
  }

  .introText {
    font-size: clamp(1rem, 4.5vw, 1.3rem);
    padding: 0.75rem 1rem;
  }
}


</style>