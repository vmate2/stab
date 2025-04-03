<template>
  <div class="loginCont">
    <form class="login" @submit.prevent="login()">
      <div class="group" id="usernameGroup"  aria-autocomplete="both" style="display: flex;">
        <div class="inputGroup">
          <input required="" type="text" class="input" v-model="username">
          <span class="highlight"></span>
          <span class="bar"></span>
          <label>Felhasználónév</label>
        </div>
        <div class="viewPass"></div>
      </div>
      <div class="group" id="passwordGroup"  aria-autocomplete="both" style="display: flex;" >
        <div class="inputGroup">
          <input required="" :type="inputType" class="input" v-model="password">
          <span class="highlight"></span>
          <span class="bar"></span>
          <label>Jelszó</label>
        </div>
        <div class="viewPass" v-if="!passHidden" @click="passHidden = !passHidden; inputType = 'text'">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div>
        <div class="viewPass" v-if="passHidden" @click="passHidden = !passHidden; inputType = 'password'">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div>
      </div>
      <div class="group" id="buttonGroup" aria-controls="loginButton">
        <button class="button" data-text="Awesome">
            <span class="actual-text">&nbsp;Bejelentkezés&nbsp;</span>
            <span aria-hidden="true" class="hover-text">&nbsp;Bejelentkezés&nbsp;</span>
        </button>
      </div>
    </form>
  </div>
    <Spinner v-if="pending" />
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
const refreshTokenCookie = useCookie('refreshToken');
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
      username: btoa(username.value.trim()),
      password: btoa(password.value.trim()),
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
      tokenCookie.value = response.data.value.accessToken;
      refreshTokenCookie.value = response.data.value.refreshToken;
      
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
  nav {
    position: absolute;
  }

  .button {
    --fs-size: 1.45rem !important;
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

.login {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
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
  font-size: 20px;
  flex-wrap: wrap;
  flex-direction: column;
  user-select: none;
  animation: popUp 1s ease-out;
  position: relative;
  top: -10vh;
  transition: all 1.5s ease;
  padding: 0.5%;
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
  top: 8px;
  left: -25px;
  cursor: pointer;
}

.group {
  position: relative;
  margin-top: 100px;
  max-width: 100%;
  width: fit-content;
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
  margin-top: 15%;
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