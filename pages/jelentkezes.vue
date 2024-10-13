<template>
  <div>
    <div class="jelentkezes">Jelentkezés</div>
    <div class="jelentkezescont">
      <div class="group" v-if="notyetsucess">
        <input required type="text" class="input" spellcheck="false" v-model="name" minlength="8">
        <span class="highlight"></span>
        <span class="bar"></span>
        <label class="lbl">Teljes név*</label>
      </div>
      <div class="group" v-if="notyetsucess">
        <input required type="email" class="input" spellcheck="false" v-model="email">
        <span class="highlight"></span>
        <span class="bar"></span>
        <label class="lbl">e-mail cím*</label>
      </div>
      <div class="group" v-if="notyetsucess">
        <input required type="tel" class="input" spellcheck="false" v-model="phone" maxlength="12" minlength="11">
        <span class="highlight"></span>
        <span class="bar"></span>
        <label class="lbl">Telefonszám*</label>
      </div>
      <div class="group" style="margin-bottom: 80px;" v-if="notyetsucess">
        <input required type="text" class="input" spellcheck="false" v-model="iskola">
        <span class="highlight"></span>
        <span class="bar"></span>
        <label class="lbl">Iskola*</label>
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
      <button v-if="notyetsucess" class="animated-button" @click="jelentkezesAction()">
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
      <div class="done" v-if="!notyetsucess">Sikeres jelentkezés!</div>
    </div>
    </div>
    <div class="popupCont" v-if="popup">
      <div class="popup">
        <p style="text-align: center; text-shadow: black 2px 2px;">A jelentkezésed elbírálásával kapcsolatban e-mailben küldünk tájékoztatást!</p>
        <p style="text-align: center; text-shadow: black 2px 2px;">A jelentketéssel elfogadod az <NuxtLink target="_blank" to="/iranyelvek" style="text-shadow: none !important; text-decoration: underline;">adatkezelési irányelveinket</NuxtLink> és <NuxtLink to="/iranyelvek" style="text-shadow: none !important; text-decoration: underline;">általános szabályzatunkat</NuxtLink>. </p>
        <p style="text-align: center; text-shadow: black 2px 2px;">Az elbírálás ~1 hetet vesz igénybe.</p>
      </div>
    </div>
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
const popup = ref(true);

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto'; // Reset the height
  textarea.style.height = textarea.scrollHeight + 'px'; // Set it to the scroll height
};

import { onMounted, popScopeId } from 'vue';
import { ref, nextTick } from 'vue';
import jelentkezes from '~/server/api/jelentkezes';

const onCaptchaSuccess = (token: string) => {
  captchasuccess.value = true;
};

onMounted(() => {
  // Ensure it's only run on the client-side
  if (typeof window !== 'undefined') {
    window.onCaptchaSuccess = onCaptchaSuccess;
  }
});

const waitForElement = async () => {
  await nextTick();
  if (captcha.value !== null) {
    window.location.reload();
  }
};

const jelentkezesAction = async () => {
  if (name.value && email.value && phone.value && iskola.value && szemelyleiras.value && selectedOption.value /*&& captchasuccess.value*/) {
  /*const jelentkezesData = {name: name.value, email: email.value, phone: phone.value, school: iskola.value, personaldesc: szemelyleiras.value, raer: selectedOption.value}
  const response = await $fetch('/api/jelentkezes', {
    method: 'POST',
    body: jelentkezesData,
  });
  console.log(response)*/
  popup.value = true;


  } else {
    console.log('not success')
    invalid.value = true;
  }

}

waitForElement();


</script>

<style>

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
  animation: floatFromBottom 1s ease-in-out forwards;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 80px;
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