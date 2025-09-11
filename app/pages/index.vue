<template>
  <div class="landing">
    <!-- Floating background suits -->
    <div class="suit">♠</div>
    <div class="suit">♥</div>
    <div class="suit">♦</div>
    <div class="suit">♣</div>

    <!-- Title -->
    <h1 class="title">
      <span>F</span>
      <span>I</span>
      <span>N</span>
      <span>A</span>
      <span>L</span>
      <span>D</span>
      <span>E</span>
      <span>A</span>
      <span>L</span>
    </h1>
    <h2 class="title2">
      <span>A</span>
      <span>33.</span>
      <span>Garabonciás</span>
      <span>napok</span>
      <span>Trefortos</span>
      <span>stábja.</span>
    </h2>

    <!-- Call-to-action -->
    <button class="cta-btn" @click="navigateTo('/rolunk')">Rólunk</button>
  </div>
    <client-only>
    <wheelspin v-if="showSpin"
      @dontShow="handleDontShow"
      @win="handleWin($event)"
      :disappear="disappear"
    />
    </client-only>
</template>

<style>
/* RESET */
.landing, .landing * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.landing {
  width: 100%;
  height: 100%;
}

.landing {
  font-family: 'Segoe UI', sans-serif;
  background-color: var(--background-trietary-color);
  color: #fff;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}

/* Floating card suits background */
.suit {
  position: absolute;
  font-size: 2.5rem;
  opacity: 0.15;
  animation: float 12s infinite linear;
  user-select: none;
  pointer-events: none;
}

@keyframes float {
  from { transform: translateY(100vh) rotate(0deg); }
  to { transform: translateY(-20vh) rotate(360deg); }
}

.suit:nth-child(1) { left: 10%; animation-duration: 14s; }
.suit:nth-child(2) { left: 30%; animation-duration: 11s; }
.suit:nth-child(3) { left: 55%; animation-duration: 15s; }
.suit:nth-child(4) { left: 80%; animation-duration: 12s; }

/* Casino Title with slot effect */
.title {
  font-size: clamp(2rem, 8vw, 5rem);
  letter-spacing: 4px;
  text-transform: uppercase;
  display: flex;
  gap: 6px;
  z-index: 2;
}

.title2 {
  font-size: clamp(0.1rem, 2vw, 1.3rem);
  letter-spacing: 4px;
  text-transform: uppercase;
  display: flex;
  gap: 6px;
  z-index: 2;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}


.title span {
  display: inline-block;
  animation: slot 1s ease forwards;
  transform: translateY(-100%);
}

.title2 span {
  display: inline-block;
  animation: slot 1s ease forwards;
  transform: translateY(-100%);
}

.title2 span:nth-child(even) {
  animation-delay: 0.2s;
}
.title2 span:nth-child(odd) {
  animation-delay: 0.4s;
}

.title span:nth-child(odd) {
  animation-delay: 0.2s;
}
.title span:nth-child(even) {
  animation-delay: 0.4s;
}

@keyframes slot {
  0% { transform: translateY(-100%); opacity: 0; }
  60% { transform: translateY(20%); opacity: 1; }
  100% { transform: translateY(0); }
}

/* Glow button */
.cta-btn {
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(45deg, #b22222, #ffcc00);
  color: #000;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.3s;
  z-index: 2;
}

.cta-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px #ffcc00, 0 0 40px #ff0000;
}

/* Responsive layout */
@media (max-width: 600px) {
  .title {
    font-size: 2.5rem;
    text-align: center;
    flex-wrap: wrap;
  }
  .title2 {
    font-size: 1rem;
    text-align: center;
    flex-wrap: wrap;
  }
  .cta-btn {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
  }
}
</style>

<script lang="ts" setup>

definePageMeta({
  layout: 'main',
  title: 'Főoldal',
  description: '33. Garabonciás napokon a Trefort Ágoston iskola stábja, a FinalDeal. Jelölt: Madai Isvtván Richárd, Kampányfőnökök: Varga Máté, Rafael Nóra, Petrás Áron Richárd. Témavilág: kaszinó, szín: Bordó. '
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
    method: 'post',
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