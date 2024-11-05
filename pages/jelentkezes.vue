<template>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div class="jelentkezes">Jelentkezés</div>
    <div class="jelentkezescont floatIn" ref="jelentkezesCont">
      <div class="group" v-if="notyetsucess">
        <input required type="text" class="input" spellcheck="false" v-model="name">
        <span class="highlight"></span>
        <span class="bar"></span>
        <label class="lbl">Teljes név*</label>
      </div>
      <p style="color: red;" >{{ errorlist.name }}</p>
      <div class="group" v-if="notyetsucess">
        <input required type="text" class="input" spellcheck="false" v-model="email">
        <span class="highlight"></span>
        <span class="bar"></span>
        <label class="lbl">e-mail cím*</label>
        <p style="color: red;">{{ errorlist.email }}</p>
      </div>
      <div class="group" v-if="notyetsucess">
        <input required type="tel" class="input" spellcheck="false" v-model="phone" maxlength="12">
        <span class="highlight"></span>
        <span class="bar"></span>
        <label class="lbl">Telefonszám*</label>
        <p style="color: red;">{{ errorlist.phone }}</p>
      </div>
      <div class="group" style="margin-bottom: 80px;" v-if="notyetsucess">
        <input required type="text" class="input" spellcheck="false" v-model="iskola">
        <span class="highlight"></span>
        <span class="bar"></span>
        <label class="lbl">Iskola*</label>
        <p v-if="errorlist.iskola" style="color: red;">{{ errorlist.iskola }}</p>
      </div>

      <div  v-if="notyetsucess" style="color: #999; font-size: 1.2rem; margin-bottom: 20px; user-select: none; text-align: center;">Mit tudnál hozzátenni a stábhoz? Miben vagy jó?*</div>
      <textarea v-if="notyetsucess"  name="szemelyleiras" v-model="szemelyleiras" class="longtext" @input="autoResize"></textarea>
      <div  v-if="notyetsucess" style="color: #999; font-size: 1.2rem; margin-bottom: 20px; user-select: none; text-align: center;">Mikor tudnál jönni gyűlésekre?*</div>
      <div  v-if="notyetsucess" class="radio-group" style="user-select: none;">
        <input type="radio" id="option1" value="1" v-model="selectedOption" class="radio-input" style="visibility: hidden;">
        <label for="option1" class="radio-label">
          <span class="radio-inner-circle" :style="{ backgroundColor: selectedOption === '1' ? 'white' : '' }"></span>Majdnem mindig
        </label>

        <input type="radio" id="option2" value="2" v-model="selectedOption" class="radio-input" style="visibility: hidden;">
        <label for="option2" class="radio-label">
          <span class="radio-inner-circle" :style="{ backgroundColor: selectedOption === '2' ? 'white' : '' }"></span>Általában igen
        </label>

        <input type="radio" id="option3" value="3" v-model="selectedOption" class="radio-input" style="visibility: hidden;">
        <label for="option3" class="radio-label">
          <span class="radio-inner-circle" :style="{ backgroundColor: selectedOption === '3' ? 'white' : '' }"></span>Általában nem
        </label>

        <input type="radio" id="option4" value="4" v-model="selectedOption" class="radio-input" style="visibility: hidden;">
        <label for="option4" class="radio-label">
          <span class="radio-inner-circle" :style="{ backgroundColor: selectedOption === '4' ? 'white' : '' }"></span>Nagyon ritkán
        </label>
      </div>
      <form v-if="notyetsucess"  action="" method="POST" ref="captcha">
        <div class="g-recaptcha" 
             data-sitekey="6LeQMGAqAAAAAEqHNK6goX7mwK-FI_-op82hZVpW"
             data-callback="onCaptchaSuccess" 
             data-action="LOGIN"></div>
        <br/>
      </form>
      <div v-if="invalid && notyetsucess"  style="color: red; margin-top: 20px; font-size: 1.3rem; text-align: center; text-shadow: black 2px 2px; user-select: none;   box-shadow: rgba(200, 0, 0, 0.2) 0px 0px 5px 5px; background-color: rgba(200, 0, 0, 0.2);">Minden mező kitöltése kötelező!</div>
      <div  v-if="notyetsucess" style="margin-bottom: 50px;">
      <button class="continue-application btn" @click="jelentkezesAction()"  style="margin-top: 50px">
          <div>
              <div class="pencil"></div>
              <div class="folder">
                  <div class="top">
                      <svg viewBox="0 0 24 27">
                          <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z"></path>
                      </svg>
                  </div>
                  <div class="paper"></div>
              </div>
          </div>
          Jelentkezés folytatása
      </button>
    </div>
    <div class="done" v-if="!notyetsucess" style="user-select: none; text-shadow: black 2px 2px;">Sikeres jelentkezés!</div>
    </div>
    <div class="popupCont" v-if="popupVisible">
      <div class="popup appear" ref="popupElement">
        <p style="text-align: center; text-shadow: black 2px 2px; line-height: 4vh;">A jelentkezésed elbírálásával kapcsolatban e-mailben küldünk tájékoztatást!</p>
        <p style="text-align: center; text-shadow: black 2px 2px;line-height: 4vh;">A jelentketéssel elfogadod az <NuxtLink target="_blank" to="/iranyelvek" style="text-shadow: none !important; text-decoration: underline;">adatkezelési irányelveinket</NuxtLink> és <NuxtLink to="/iranyelvek" style="text-shadow: none !important; text-decoration: underline;">általános szabályzatunkat</NuxtLink>. </p>
        <p style="text-align: center; text-shadow: black 2px 2px; line-height: 4vh;">Az elbírálás ~1 hetet vesz igénybe.</p>
        <div style="text-align: center; text-shadow: black 2px 2px; align-items: center; justify-content: center;">
          <input type="checkbox" name="x" id="x" v-model="accTerms">
          <label for="x">Elolvastam és elfogadtam a feltételeket</label>
        </div>
        <p v-if="notaccepted" style="color: red; text-align: center; text-decoration: underline; user-select: none;">A jelentkezéshez fogadd el a feltételeket!</p>
        <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap; flex-direction: row; margin-top: 40%;">
          <button class="animated-button megse" style="margin-right:  5%; color: red;     box-shadow: 0 0 0 2px red; fill: red;" @click="abort()">
            <svg viewBox="0 0 24 24" class="arr-2" xmlns="http://www.w3.org/2000/svg" style="color: red; fill: red;">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
            <span class="text">Mégse</span>
            <span class="circle" style="background-color: red !important;"></span>
            <svg viewBox="0 0 24 24" class="arr-1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
          </button>
          <button class="animated-button" style="margin-left: 5%;" @click="confirmed()">
            <svg viewBox="0 0 24 24" class="arr-2" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
            <span class="text">Jelentkezés</span>
            <span class="circle"></span>
            <svg viewBox="0 0 24 24" class="arr-1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="refused" class="refusedCont">
      <div>Időkorlát! Próbálkozz később! (30perc)</div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
layout: 'main'
});
const name = ref('');
const email = ref('');
const phone = ref('');
const iskola = ref('');
const szemelyleiras = ref('');
const selectedOption = ref(''); // For storing the selected radio option
const captcha = ref(null);
const captchasuccess = ref(false);
const invalid = ref(false);
const notyetsucess = ref(true);
const popup = ref(false);
const popupElement = ref();
const accTerms = ref(false);
const notaccepted = ref(false);
const jelentkezesCont = ref();
const refused = ref(false);

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto'; // Reset the height
  textarea.style.height = textarea.scrollHeight + 'px'; // Set it to the scroll height
};

import { onMounted, popScopeId } from 'vue';
import { ref, nextTick } from 'vue';
import jelentkezes from '~/server/api/jelentkezes';
import { onBeforeUnmount, watch } from 'vue';
import e from 'express';
import { UNABLE_TO_FIND_POSTINSTALL_TRIGGER_JSON_SCHEMA_ERROR } from '@prisma/client/scripts/postinstall.js';
import { generateKey } from 'crypto';

// Ref to control the visibility of the popup
const popupVisible = ref(false);

// Function to handle body scroll based on popup visibility
const handleBodyScroll = () => {
  if (popupVisible.value) {
    document.body.style.overflow = 'hidden'; // Prevent body scrolling when popup is visible
  } else {
    document.body.style.overflow = 'auto'; // Re-enable body scrolling when popup is hidden
  }
};
// Function to toggle popup visibility
const togglePopup = () => {
  popupVisible.value = !popupVisible.value;
};

// Watch for changes in popup visibility and adjust body scroll
watch(popupVisible, handleBodyScroll);

// Clean up body scroll style on component unmount
onBeforeUnmount(() => {
  document.body.style.overflow = 'auto';
});

const onCaptchaSuccess = (token: string) => {
  captchasuccess.value = true;
};

onMounted(async () => {
  // Ensure it's only run on the client-side
  if (typeof window !== 'undefined') {
    window.onCaptchaSuccess = onCaptchaSuccess;
  };
   const shouldRefuse = await $fetch('/api/server', {
    method: 'POST',
    body: {type: 'checkTimeout', key: await constructKey(), data: await getIP()}
   });
   if (shouldRefuse === true) {
    refused.value = true;
    setTimeout(() => {
      navigateTo('/');
    }, 4000);
   }
});

const waitForElement = async () => {
  await nextTick();
  if (captcha.value !== null) {
    window.location.reload();
  }
};

const regexName = /^[a-zA-Z\séáűőúíöü]+$/;
const regexTel = /^[0-9+]+$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const errorlist = ref<{ [key: string]: string }>({});
const jelentkezesAction = async () => {
  if (name.value && email.value && phone.value && iskola.value && szemelyleiras.value && selectedOption.value /*&& captchasuccess.value*/) {
    errorlist.value = {};
    if (!regexName.test(name.value) || name.value.split(' ').filter(space => space === '').length > 2) {
      errorlist.value['name'] = "Valós nevet adj meg (max 3 név)!";
    }
    if (!regexEmail.test(email.value) || !(email.value.endsWith(".com") || email.value.endsWith(".hu")) || !email.value.includes('@')) {
      errorlist.value['email'] = "Valós e-mailt adj meg!";
    }
    if (!regexTel.test(phone.value) || phone.value.length < 10) {
      errorlist.value['phone'] = "Valós telefonszámot adj meg!";
    }
    if (!regexName.test(iskola.value)) {
      errorlist.value['iskola'] = "Valós iskolát adj meg!";
    }
    console.log(errorlist);

  if (!errorlist.value.name && !errorlist.value.email && !errorlist.value.phone && !errorlist.value.iskola) {
    togglePopup()
  }


  } else {
    console.log('not success')
    invalid.value = true;
  }

}

waitForElement();

const constructKey = async () => {
  const date = new Date();
  const formattedDate = date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).replace(',', '');

  console.log(formattedDate);
  return await getHashedDate(formattedDate);
}

async function getHashedDate(formattedDate:string) {
  return sha256(formattedDate).then(hash => {
    return hash;
  });
}

async function sha256(message:string) {
  const msgBuffer = new TextEncoder().encode(message);

  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

const getIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
  }
};

const getDate = () => {
  return new Date().toISOString();
}


const abort = () => {
  popupElement.value.classList.remove('appear');
  popupElement.value.classList.add('disappear');
  setTimeout(() => {
    togglePopup()
  }, 1000);

}

const confirmed = async () => {
  if (accTerms.value) {
    const jelentkezesData = {name: name.value, email: email.value, phone: phone.value, school: iskola.value, personaldesc: szemelyleiras.value, raer: selectedOption.value, ip: await getIP(), date: getDate()}
    const response = await $fetch('/api/jelentkezes', {
      method: 'POST',
      body: {data: jelentkezesData, key: await constructKey()},
    });
  console.log(response)
    popupElement.value.classList.remove('appear');
    popupElement.value.classList.add('disappear');
    setTimeout(() => {
      togglePopup();
      notyetsucess.value = false;
      setTimeout(() => {
        jelentkezesCont.value.classList.remove('floatIn');
        jelentkezesCont.value.classList.add('disappear');
        setTimeout(() => {
          navigateTo('/', )
        }, 800);
      }, 500);
    }, 1000);
  } else {
    notaccepted.value = true;
  }
}

</script>

<style>

.refusedCont {
  width: 100vw;
  height: 100vh;
  position: fixed;
  margin: 0;
  top: 0;
  left: 0;
  background-color: #212121;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  color: red;
  font-size: 40px;
  z-index: 10000;
}

.megse svg{
  fill: red !important;
}

.continue-application {
  --color: #fff;
  --background: #404660;
  --background-hover: #3A4059;
  --background-left: #2B3044;
  --folder: #F3E9CB;
  --folder-inner: #BEB393;
  --paper: #FFFFFF;
  --paper-lines: #BBC1E1;
  --paper-behind: #E1E6F9;
  --pencil-cap: #fff;
  --pencil-top: #275EFE;
  --pencil-middle: #fff;
  --pencil-bottom: #5C86FF;
  --shadow: rgba(13, 15, 25, .2);
  border: none;
  outline: none;
  cursor: pointer;
  position: relative;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  line-height: 19px;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  padding: 17px 29px 17px 69px;
  transition: background 0.3s;
  color: var(--color);
  background: var(--bg, var(--background));
}

.continue-application > div {
  top: 0;
  left: 0;
  bottom: 0;
  width: 53px;
  position: absolute;
  overflow: hidden;
  border-radius: 5px 0 0 5px;
  background: var(--background-left);
}

.continue-application > div .folder {
  width: 23px;
  height: 27px;
  position: absolute;
  left: 15px;
  top: 13px;
}

.continue-application > div .folder .top {
  left: 0;
  top: 0;
  z-index: 2;
  position: absolute;
  transform: translateX(var(--fx, 0));
  transition: transform 0.4s ease var(--fd, 0.3s);
}

.continue-application > div .folder .top svg {
  width: 24px;
  height: 27px;
  display: block;
  fill: var(--folder);
  transform-origin: 0 50%;
  transition: transform 0.3s ease var(--fds, 0.45s);
  transform: perspective(120px) rotateY(var(--fr, 0deg));
}

.continue-application > div .folder:before, .continue-application > div .folder:after,
.continue-application > div .folder .paper {
  content: "";
  position: absolute;
  left: var(--l, 0);
  top: var(--t, 0);
  width: var(--w, 100%);
  height: var(--h, 100%);
  border-radius: 1px;
  background: var(--b, var(--folder-inner));
}

.continue-application > div .folder:before {
  box-shadow: 0 1.5px 3px var(--shadow), 0 2.5px 5px var(--shadow), 0 3.5px 7px var(--shadow);
  transform: translateX(var(--fx, 0));
  transition: transform 0.4s ease var(--fd, 0.3s);
}

.continue-application > div .folder:after,
.continue-application > div .folder .paper {
  --l: 1px;
  --t: 1px;
  --w: 21px;
  --h: 25px;
  --b: var(--paper-behind);
}

.continue-application > div .folder:after {
  transform: translate(var(--pbx, 0), var(--pby, 0));
  transition: transform 0.4s ease var(--pbd, 0s);
}

.continue-application > div .folder .paper {
  z-index: 1;
  --b: var(--paper);
}

.continue-application > div .folder .paper:before, .continue-application > div .folder .paper:after {
  content: "";
  width: var(--wp, 14px);
  height: 2px;
  border-radius: 1px;
  transform: scaleY(0.5);
  left: 3px;
  top: var(--tp, 3px);
  position: absolute;
  background: var(--paper-lines);
  box-shadow: 0 12px 0 0 var(--paper-lines), 0 24px 0 0 var(--paper-lines);
}

.continue-application > div .folder .paper:after {
  --tp: 6px;
  --wp: 10px;
}

.continue-application > div .pencil {
  height: 2px;
  width: 3px;
  border-radius: 1px 1px 0 0;
  top: 8px;
  left: 105%;
  position: absolute;
  z-index: 3;
  transform-origin: 50% 19px;
  background: var(--pencil-cap);
  transform: translateX(var(--pex, 0)) rotate(35deg);
  transition: transform 0.4s ease var(--pbd, 0s);
}

.continue-application > div .pencil:before, .continue-application > div .pencil:after {
  content: "";
  position: absolute;
  display: block;
  background: var(--b, linear-gradient(var(--pencil-top) 55%, var(--pencil-middle) 55.1%, var(--pencil-middle) 60%, var(--pencil-bottom) 60.1%));
  width: var(--w, 5px);
  height: var(--h, 20px);
  border-radius: var(--br, 2px 2px 0 0);
  top: var(--t, 2px);
  left: var(--l, -1px);
}

.continue-application > div .pencil:before {
  -webkit-clip-path: polygon(0 5%, 5px 5%, 5px 17px, 50% 20px, 0 17px);
  clip-path: polygon(0 5%, 5px 5%, 5px 17px, 50% 20px, 0 17px);
}

.continue-application > div .pencil:after {
  --b: none;
  --w: 3px;
  --h: 6px;
  --br: 0 2px 1px 0;
  --t: 3px;
  --l: 3px;
  border-top: 1px solid var(--pencil-top);
  border-right: 1px solid var(--pencil-top);
}

.continue-application:before, .continue-application:after {
  content: "";
  position: absolute;
  width: 10px;
  height: 2px;
  border-radius: 1px;
  background: var(--color);
  transform-origin: 9px 1px;
  transform: translateX(var(--cx, 0)) scale(0.5) rotate(var(--r, -45deg));
  top: 26px;
  right: 16px;
  transition: transform 0.3s;
}

.continue-application:after {
  --r: 45deg;
}

.continue-application:hover {
  --cx: 2px;
  --bg: var(--background-hover);
  --fx: -40px;
  --fr: -60deg;
  --fd: .15s;
  --fds: 0s;
  --pbx: 3px;
  --pby: -3px;
  --pbd: .15s;
  --pex: -24px;
}

.popupCont {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
}

.popup {
  width: 40vw;
  height: fit-content;
  min-height: 400px;
  background-color: #212121;
  z-index: 10;
  min-width: 330px;
  border: 2px solid black;
  border-radius: 20px;
  padding: 20px;
}
.appear {
  transition: all 1s ease;
  animation: appear 1s ease-out;
}

@keyframes appear {
  from {
    scale: 0;
  }
  to {
    scale: 1;
  }
}

@keyframes disappear {
  from {
    scale: 1;
  }
  to {
    scale: 0;
  }
}

.disappear {
  animation: disappear 1s ease-in;
}

.done {
  font-size: 2.5rem;
  color: green;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Add space between each radio button */
  margin-bottom: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  padding: 0.5em;
  background-color: #111;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: background-color 0.2s, border-color 0.2s;
  color: #fff;
  cursor: pointer;
}

.radio-label:hover {
  background-color: #333;
}

.radio-input {
  margin-right: 10px; /* Add space between radio button and label */
}

.radio-input:checked + .radio-inner-circle {
  border-color: #ff1111;
}

.radio-inner-circle {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid #fff;
  border-radius: 50%;
  transition: border-color 0.2s;
  position: relative;
  margin-right: 5px;
}

.radio-inner-circle::after {
  content: '';
  display: none;
}

.radio-input:checked + .radio-inner-circle::after {
  display: block;
  width: 0.5em;
  height: 0.5em;
  background-color: #ff1111;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.longtext {
  width: 80%;
  resize: none;
  background-color: #515151;
  font-size: 1rem;
  margin-bottom: 50px;
}

.jelentkezes {
  position: relative;
  text-align: center;
  margin-bottom: 50px;
  font-size: 6rem;
  user-select: none;
  text-shadow: rgba(0, 0, 0, 0.4) 4px 4px;
  transition: all 1s;
  animation: floatFromTop 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
}

.jelentkezescont {
  position: relative;
  width: 35vw;
  min-height: 50vh;
  height: fit-content;
  background-color: rgba(0, 0, 0, 0.2);
  min-width: 330px;
  border: 2px solid black;
  border-radius: 14px;
  box-shadow: rgba(0, 0, 0, 0.4) 4px 4px 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 80px;
}

.floatIn {
  animation: floatFromBottom 1s ease-in-out forwards;
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

  .lbl {
    position: absolute;
   color: #999;
   font-size: 18px;
   font-weight: normal;
   pointer-events: none;
   left: 5px;
   top: 10px;
   transition: 0.2s ease all;
   -moz-transition: 0.2s ease all;
   -webkit-transition: 0.2s ease all;
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
   -moz-transition: 0.2s ease all;
   -webkit-transition: 0.2s ease all;
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

.animated-button .arr-22 {
  left: -25%;
  fill: red;
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
  color: #212121 !important;
  border-radius: 12px;
  fill: #212121 !important;
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
.megse:hover svg {
  fill: #212121 !important;
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
    

@keyframes floatFromTop {
  from {
    top: -100vh;
  }
  to {
    top: 0vh;
  }
}

@keyframes floatFromBottom {
  from {
    top: 100vh;
  }
  to {
    top: 0vh;
  }
}


@media (max-width: 768px) {
  .jelentkezes {
    font-size: 3rem;
  }


}




</style>