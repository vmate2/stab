<template>
  <div>
    <div class="loginCont" :class="{ animateClose: isLoggedIn }">
      <div v-if="!isLoggedIn">
        <div class="loginFelirat">Bejelentkezés</div>
        <div class="group">
          <input required type="text" class="input" spellcheck="false" v-model="username">
          <span class="highlight"></span>
          <span class="bar"></span>
          <label>Felhasználónév</label>
        </div>
        <div class="group">
          <input required :type="inputType" class="input" spellcheck="false" v-model="password">
          <span class="highlight"></span>
          <span class="bar"></span>
          <label>Jelszó</label>
          <div v-if="!passHidden" class="viewPass" @click="passHidden = true; inputType = 'text'">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <div v-else class="viewPass" @click="passHidden = false; inputType = 'password'">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          </div>
        </div>
        <button class="animated-button" @click="login()">
          <svg viewBox="0 0 24 24" class="arr-2" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
          <span class="text">Bejelentkezés</span>
          <span class="circle"></span>
          <svg viewBox="0 0 24 24" class="arr-1" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
        </button>
      </div>
      <div v-if="isLoggedIn">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 120 120">
          <ellipse cx="60" cy="64.5" opacity=".35" rx="48" ry="48.5"></ellipse>
          <ellipse cx="60" cy="60.5" fill="#44bf00" rx="48" ry="48.5"></ellipse>
          <polygon points="53.303,88 26.139,60.838 33.582,53.395 53.303,73.116 86.418,40 93.861,47.443" opacity=".35"></polygon>
          <g>
            <polygon fill="#85ff5e" points="53.303,84 26.139,56.838 33.582,49.395 53.303,69.116 86.418,36 93.861,43.443"></polygon>
          </g>
        </svg>
      </div>
    </div>
    <button @click="del()">del</button>
    <div v-if="pending">Loading...</div>
    <div v-if="error">{{ errormsg }}</div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main'
});

const passHidden = ref(false);
const inputType = ref("password");

import { ref, onMounted } from 'vue';

const runtimeConfig = useRuntimeConfig();
const secretKey = runtimeConfig.public.secretKey;

const username = ref('');
const password = ref('');
const rememberMe = ref(true);
const isLoggedIn = ref(false);
let token = '';
const tokenCookie = useCookie('token')
const errormsg = ref();
const pending = ref();
const error = ref();

// Check for a stored token on component mount
onMounted(() => {
  const storedToken = tokenCookie.value;
  if (storedToken) {
    token = storedToken;
    isLoggedIn.value = true;
  }
  if (isLoggedIn.value == true) {
    navigateTo('/stab/')
  }
});



async function login() {
  try {
    pending.value = true;
    error.value = null;

    const body = {
      username: btoa(username.value),
      password: btoa(password.value),
    };
    console.log('SENDING');
    const response = await useFetch('/api/login', {
      method: 'POST',
      body
    });

    console.log(response);
  
    
    if (response.error.value) alert(response.error.value || 'An unknown error occurred');
    errormsg.value = response.error;
    pending.value = response.pending;
    error.value = response.error;

    console.log('RECIEVED')

    if (response.data.value) {
      tokenCookie.value = response.data.value;
      console.log(response.data.value);
      
      console.log(tokenCookie.value)
      navigateTo('/stab/');
    }
  } catch (err) {
    console.error('Error during login:', err);
    error.value = err;
  } finally {
    pending.value = false;
  }
}

const del = () => {
  tokenCookie.value = undefined;
}

</script>

<style scoped>
@media (max-width: 600px) {
  .loginCont {
    width: 90vw;
    height: auto;
  }
}

@keyframes close {
  from {
    width: 100%;
    height: auto;
    opacity: 1;
  }
  to {
    width: 5px;
    height: 5px;
    opacity: 0;
  }
}


.animateClose {
  min-width: 0px !important;
  min-height: 0px !important;
  width: 100px !important;
  height: 100px !important;
  opacity: 0 !important;
}


.loginCont {
  background-color: rgba(0, 0, 0, 0.2);
  width: 30vw;
  max-width: 460px;
  min-width: 300px;
  height: auto;
  min-height: 550px;
  max-height: 600px;
  border: 2px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  text-shadow: black 2px 2px;
  flex-wrap: wrap;
  flex-direction: column;
  user-select: none;
  animation: popUp 1s ease-out;
  position: relative;
  top: -20vh;
  transition: all 1.5s ease;
}

.loginFelirat {
  color: #e8e8e8;
  font-size: clamp(1.8rem, 3vw, 2rem);
  margin-top: 10%;
}

.viewPass {
  width: 25px;
  height: 25px;
  position: relative;
  bottom: 30px;
  left: 230px;
  cursor: pointer;
}

.group {
  position: relative;
  margin-top: 100px;
}

.input {
  font-size: 16px;
  padding: 10px 10px 10px 5px;
  display: block;
  min-width: 200px;
  width: 250px;
  max-width: 70vw;
  border: none;
  border-bottom: 1px solid #515151;
  background: transparent;
}

.input:focus {
  outline: none;
}

label {
  color: #999;
  font-size: 18px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 0.2s ease all;
}

.input:focus ~ label, .input:valid ~ label {
  top: -20px;
  font-size: 14px;
  color: #5264AE;
}

.bar {
  position: relative;
  display: block;
  min-width: 200px;
  width: 250px;
  max-width: 70vw;
}

.bar:before, .bar:after {
  content: '';
  height: 2px;
  width: 0;
  bottom: 1px;
  position: absolute;
  background: #5264AE;
  transition: 0.2s ease all;
}

.bar:before {
  left: 50%;
}

.bar:after {
  right: 50%;
}

.input:focus ~ .bar:before, .input:focus ~ .bar:after {
  width: 50%;
}

.highlight {
  position: absolute;
  height: 60%;
  width: 100px;
  top: 25%;
  left: 0;
  pointer-events: none;
  opacity: 0.5;
}

.input:focus ~ .highlight {
  animation: inputHighlighter 0.3s ease;
}

@keyframes inputHighlighter {
  from {
    background: #5264AE;
  }
  to {
    width: 0;
    background: transparent;
  }
}

.animated-button {
  margin-top: 75px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 16px 36px;
  border: 4px solid;
  border-color: transparent;
  font-size: 16px;
  background-color: inherit;
  border-radius: 100px;
  font-weight: 600;
  color: greenyellow;
  box-shadow: 0 0 0 2px greenyellow;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button svg {
  position: absolute;
  width: 24px;
  fill: greenyellow;
  z-index: 9;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button .arr-1 {
  right: 16px;
}

.animated-button .arr-2 {
  left: -25%;
}

.animated-button .circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: greenyellow;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button .text {
  position: relative;
  z-index: 1;
  transform: translateX(-12px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button:hover {
  box-shadow: 0 0 0 12px transparent;
  color: #212121;
  border-radius: 12px;
}

.animated-button:hover .arr-1 {
  right: -25%;
}

.animated-button:hover .arr-2 {
  left: 16px;
}

.animated-button:hover .text {
  transform: translateX(12px);
}

.animated-button:hover svg {
  fill: #212121;
}

.animated-button:active {
  scale: 0.95;
  box-shadow: 0 0 0 4px greenyellow;
}

.animated-button:hover .circle {
  width: 220px;
  height: 220px;
  opacity: 1;
}

@keyframes popUp {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>