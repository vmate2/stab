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
      <button v-if="!showSpin" @click="resetSpinDebug">Reset Spin (Debug)</button>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: 'main'
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

<style>



</style>