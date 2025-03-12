<template>
  <div>
    <div class="loginCont" :class="{ animateClose: isLoggedIn }">
      <div v-if="!isLoggedIn" class="container">
        <div class="loginFelirat">Bejelentkezés</div>
        <div class="group">
          <input required type="text" class="input" spellcheck="false" v-model="username" autocomplete="username">
          <span class="highlight"></span>
          <span class="bar"></span>
          <label>Felhasználónév</label>
        </div>
        <div class="group" style="display: flex; align-items: center; flex-direction: row; flex-wrap: wrap;">
          <div>
            <input required :type="inputType" class="input" spellcheck="false" v-model="password" autocomplete="current-password">
            <span class="highlight"></span>
            <span class="bar"></span>
            <label>Jelszó</label>
          </div>
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
        <button class="button" data-text="Awesome">
          <span class="actual-text">&nbsp;bejelentkezés&nbsp;</span>
          <span aria-hidden="true" class="hover-text">&nbsp;bejelentkezés&nbsp;</span>
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
    <div v-if="pending">Loading...</div>
    <div v-if="error">{{ errormsg }}</div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main'
});

import { ref, onMounted } from 'vue';
const { $notify } = useNuxtApp();

const passHidden = ref(false);
const inputType = ref("password");
const username = ref('');
const password = ref('');
const isLoggedIn = ref(false);
const tokenCookie = useCookie('token');
const errormsg = ref();
const pending = ref();
const error = ref();

// Check for a stored token on component mount
onMounted(() => {
  const storedToken = tokenCookie.value;
  if (storedToken) {
    isLoggedIn.value = true;
  }
  if (isLoggedIn.value) {
    navigateTo('/stab/');
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
    const response = await useFetch('/api/login', {
      method: 'POST',
      body
    });

    if (response.error.value) $notify(response.error.value || 'An unknown error occurred', 'warning');
    errormsg.value = response.error;
    pending.value = response.pending;
    error.value = response.error;

    if (response.data.value) {
      tokenCookie.value = response.data.value;
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

.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
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
  top: -10vh;
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
  left: -20px;
  cursor: pointer;
}

.group {
  position: relative;
  margin-top: 100px;
  max-width: 100%;
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

.button {
  margin: 0;
  height: auto;
  background: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
}

/* button styling */
.button {
  --border-right: 6px;
  --text-stroke-color: rgba(255,255,255,0.6);
  --animation-color: #37FF8B;
  --fs-size: 2em;
  letter-spacing: 3px;
  text-decoration: none;
  font-size: var(--fs-size);
  font-family: "Arial";
  position: relative;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1px var(--text-stroke-color);
}
/* this is the text, when you hover on button */
.hover-text {
  position: absolute;
  box-sizing: border-box;
  content: attr(data-text);
  color: var(--animation-color);
  width: 0%;
  inset: 0;
  border-right: var(--border-right) solid var(--animation-color);
  overflow: hidden;
  transition: 0.5s;
  -webkit-text-stroke: 1px var(--animation-color);
}
/* hover */
.button:hover .hover-text {
  width: 100%;
  filter: drop-shadow(0 0 23px var(--animation-color))
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