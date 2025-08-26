<script setup lang="ts">

async function sendData() {
  const encrypted = await encryptClient('Secret message!')
  const encryptedData = await $fetch('/api/receive', { method: 'POST', body: { data: encrypted } })
  const plainText = await decryptClient(encryptedData)
  console.log(plainText);
  
}
</script>

<template>
  <button @click="sendData">Send Secret</button>
</template>
