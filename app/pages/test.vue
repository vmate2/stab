<template>
  <div>
    <div v-if="!isLoggedIn">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <label>
        <input type="checkbox" v-model="rememberMe" /> Remember Me
      </label>
      <button @click="login">Login</button>
    </div>
    <div v-else>
      <button @click="sendEncryptedMessage">Send Encrypted Message</button>
      <p>Server Response: {{ serverResponse }}</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import CryptoJS from 'crypto-js';
import { ref, onMounted } from 'vue';

const runtimeConfig = useRuntimeConfig();
const secretKey = runtimeConfig.public.secretKey;

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoggedIn = ref(false);
const serverResponse = ref('');
let token = '';

// Check for a stored token on component mount
onMounted(() => {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    token = storedToken;
    isLoggedIn.value = true;
  }
});

function encryptMessage(message) {
  return CryptoJS.AES.encrypt(message, secretKey).toString();
}

async function login() {
  const { data } = await useFetch('/api/login', {
    method: 'POST',
    body: { username: username.value, password: password.value },
  });

  if (data.value.token) {
    token = data.value.token;
    isLoggedIn.value = true;

    // Store the token in localStorage if "Remember Me" is checked
    if (rememberMe.value) {
      localStorage.setItem('token', token);
    }
  }
}

async function sendEncryptedMessage() {
  const message = 'Hello from the client!';
  const encryptedMessage = encryptMessage(message);

  const { data } = await useFetch('/api/encrypt', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { encryptedMessage },
  });

  // Decrypt the server's response
  const decryptedResponse = decryptMessage(data.value.encryptedResponse);
  serverResponse.value = decryptedResponse;
}

function decryptMessage(encryptedMessage) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function logout() {
  localStorage.removeItem('token'); // Clear the stored token
  token = '';
  isLoggedIn.value = false;
}
</script>