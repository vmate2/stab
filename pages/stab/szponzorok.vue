<template>
  <div>
    <h1>Encryption Example</h1>
    <button @click="handleEncrypt">Encrypt Message</button>
    <p v-if="encryptedMessage">Encrypted Message: {{ encryptedMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useEncryption } from '~/composables/useEncryption';

definePageMeta({
  layout: 'stab',
});

const { encrypt } = useEncryption();
const encryptedMessage = ref<string | null>(null);

async function handleEncrypt() {
  try {
    const data = {
      message: 'Hello, Server!',
      timestamp: Date.now(),
      user: { id: 123, name: 'John Doe' },
    };

    // Convert the object to a JSON string
    const message = JSON.stringify(data);

    // Encrypt the JSON string
    const result = await encrypt(message);

    // Send the encrypted message to the server
    const response = await $fetch('/api/encryption', {
      method: 'POST',
      body: {
        encryptedMessage: result, // Wrap the encrypted message in an object
      },
    });

    console.log(response)
    encryptedMessage.value = JSON.stringify(response);
  } catch (error) {
    console.error('Error:', error);
  }
}
</script>

<style scoped>
div {
  padding: 20px;
  font-family: Arial, sans-serif;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

p {
  margin-top: 20px;
  font-size: 18px;
  color: green;
}
</style>