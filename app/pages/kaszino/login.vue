<template>
  <div class="background">
    <div class="loginCont">
      <div class="title">{{ loginActive ? 'Bejelentkezés' : 'Regisztráció' }}</div>
      <div class="passContainer" v-if="!loginActive">
        <input type="text" name="fullname" id="fullname" v-model="fullname" placeholder="Teljes neved">
      </div>
      <div class="passContainer" v-if="!loginActive">
        <input type="email" name="email" id="email" v-model="email" placeholder="E-mail" >
      </div>
      <div class="passContainer">
        <input type="text" name="username" id="username" v-model="username" placeholder="Felhasználónév"></input>
      </div>     
      <div class="passContainer">
        <input :type="showPass ? 'password':'text'" name="password" id="password" v-model="password" placeholder="Jelszó"><svg @click="showPass = !showPass" v-if="showPass" class="eyeIcon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg><svg v-else @click="showPass = !showPass" width="40" height="40" class="eyeIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></input>
      </div>
      <div class="changeTxt" @click="loginActive = !loginActive">{{loginActive ? 'Nincs fiókod? Régisztrálj!' : 'Van már fiókod? Jelentkezz be!'}}</div>
      <button @click="loginActive ? login() : register()">{{loginActive ? 'Bejelentkezés' : 'Regisztrálok'}}</button>
    </div>
  </div>
  <notification></notification>
  <spinner v-if="loading"></spinner>
  <div class="overlay" v-if="showWarning">
    <div class="warningContainer">
      <div class="warningTitle">Figyelem!</div>
      <div class="warningText">
        <p>
          A szerencsejáték <strong>függőséget okozhat</strong>, és anyagi, valamint lelki károkat idézhet elő.
          Kérjük, <strong>játssz felelősséggel</strong>, és tarts mértéket!
        </p>
      
        <p>
          Oldalunkon <strong>valódi pénzzel játszani nem lehet</strong> - itt kizárólag
          <strong>játékpénz</strong> használható, amelyet a résztvevők
          <strong>kisebb nyereményekre válthatnak be</strong>.
        </p>
      
        <hr>
      
        <p>
          A nyert zsetonokat a <strong>Békéscsabai Garabonciás Napok</strong> keretein belül,
          <strong>2025. szeptember 28.</strong> és <strong>október 3.</strong> között,
          a <strong>Szent István téren</strong> lehet beváltani.
        </p>
      
        <p>
          Gyere el, próbáld ki magad <strong>kockázat nélkül</strong>, és élvezd a játék izgalmát
          <strong>felelősségteljes</strong> keretek között!
        </p>
      
        <small>
          Ha úgy érzed, problémád van a játékkal, kérj segítséget szakembertől vagy keress fel
          egy tanácsadó szolgálatot.
        </small>
      </div>
      <div class="warningButtonCont">
        <button class="cancel" @click="accepted = false">Mégse</button>
        <button class="accept" @click="accepted = true">Megértettem</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const { $notify, $showDialog } = useNuxtApp();
const loading = ref(false)
const loginActive = ref(true)

const username = ref('')
const password = ref('')
const email = ref('')
const fullname = ref('')

const showWarning = ref(false)
const accepted = ref()


const showPass = ref(true)

const errors = ref<string[]>([])
const accessTokenCookie = useCookie('accessTokenCasino');
console.log('CLIENT SIDE TOKEN: ', accessTokenCookie.value);
if (accessTokenCookie.value) {
  await navigateTo('/kaszino')
} else {
  onMounted(async() => {
    const response = await $fetch('/api/kaszino/genAccessToken', {
    method: 'GET',
    credentials: 'include',
    key: 'trylogin'
  });
  if(response.status === 'success') {
    await navigateTo('/kaszino')
  }
  })
}


import * as leoProfanity from "leo-profanity";
import huWords from "naughty-words/hu.json";

leoProfanity.loadDictionary("en"); // töltsd be az angol szótárat
leoProfanity.add(huWords); // magyar szavakat te adhatsz hozzá





const register = async () => {
  errors.value = []
  loading.value = true

  if (!nameRegex.test(fullname.value)) {
    errors.value.push('A teljes név formátuma nem megfelelő.')
  }
  if (!emailRegex.test(email.value)) {
    errors.value.push('Az email cím formátuma nem megfelelő.')
  }
  if (!(username.value.length <= 12 && username.value.length > 0)) {
    errors.value.push('A felhasználónév maximum 12 karakter lehet, és nem lehet üres.')
  }
  if (!passwordRegex.test(password.value)) {
    errors.value.push('A jelszó nem felel meg a követelményeknek.')
  }
  if (leoProfanity.check(username.value)) {
    errors.value.push('Nem megengedett felhasználónév!')
  }

  if (errors.value.length === 0) {
    loading.value = false
    showWarning.value = true;
    const response = await waitForUser(accepted);
          showWarning.value = false
    loading.value = true
    if (!response) {
      loading.value = false

      return
    }
    try {
      const sendData = {
        username: username.value,
        password: password.value,
        fullname: fullname.value,
        email: email.value
      }
      const encrypted = await encryptClient(JSON.stringify(sendData))
    try {
      const result = await $fetch('/api/kaszino/register', {
        method: 'POST',
        body: {
          data: encrypted
        }
      })
    
      if (result.status === 'success') {
        $notify(result.message, 'success')
      }
    } catch (error: any) {
      // Nuxt createError sends info in error.data or error.message
      const msg = error?.data?.message || error?.message || 'Ismeretlen hiba történt.'
      $notify(msg, 'error')
    } finally {
      loading.value = false
    }
    } catch (e) {
      loading.value = false
      alert('Hiba a szerverrel: ' + (e instanceof Error ? e.message : e))
    }
  } else {
    loading.value = false
    errors.value.forEach(error => {
      $notify(error, 'error')
    })
  }
}


const login = async() => {
  loading.value = true
  errors.value = []

  if (!(username.value.length <= 12 && username.value.length > 0)) {
    errors.value.push('A felhasználónév maximum 12 karakter lehet, és nem lehet üres.')
  }
  if (!password.value) {
    errors.value.push('A jelszó mező nem lehet üres!')
  }

  if (errors.value.length === 0) {
    try {
      
      const sendData = {
        username: username.value,
        password: password.value
      }

      const encrypted = await encryptClient(JSON.stringify(sendData))

      const result = await $fetch('/api/kaszino/login', {
        method: 'POST',
        body: {
          data: encrypted
        }
      }) as { status:string; message: string; refreshToken: string }

      if (result.status === 'success') {
        console.log(result.refreshToken);
        
        $notify(result.message, result.status);

        try {
          await $fetch('/api/kaszino/genAccessToken', {
            method: 'GET',
            credentials: 'include' // ⬅ important so browser stores the cookie
          })

          console.log(accessTokenCookie.value);
          log.infoPublic({
            title: 'Új casino bejelentkezés',
            type: 'casino_new_login',
            data: {
              username: username.value,
            }
          })

          await navigateTo('/kaszino', { replace: true })
        } catch (error) {
          console.error(error);
          
          $notify('Lejárt token, jelentkezz be újra!', 'warning')
          accessTokenCookie.value = '';
        }

        
      }

    } catch (error:any) {
      const msg = error?.data?.message || error?.message || 'Ismeretlen hiba történt.'
      $notify(msg, 'error')
    } finally {
      loading.value = false
    }
  } else {
    // az első hiba megjelenítése (vagy az összes)
    // például:
    errors.value.forEach(error => {
      $notify(error, 'error')
    })
    loading.value = false
  }
}

const waitForUser = (refValue: Ref<boolean>): Promise<boolean> => {
    return new Promise((resolve) => {
    // If the value is already true/false, resolve immediately
    if (typeof refValue.value === 'boolean') {
      resolve(refValue.value);
      return;
    }

    const stop = watch(refValue, (newVal) => {
      if (typeof newVal === 'boolean') {
        stop(); // stop watching
        resolve(newVal);
      }
    });
  });

}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');


.overlay {
  width: 100dvw;
  height: 100dvh;
  position: fixed;
  margin: 0;
  top: 0;
  left: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px) brightness(0.8) saturate(150%);
}

.warningContainer {
  width: 30vw;
  width: clamp(500px, 30vw, 1000px);
  height: 55vh;
  background-color: #222;
  border-radius: 14px;
  padding: 1%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.warningTitle {
  font-family: 'Bangers', cursive;
  font-size: 2.5rem;
  color: #ff0000;
  text-shadow: 2px 2px #000;
  letter-spacing: 2px;
  text-shadow: 2px 2px #9e1616  ;
}



.warningText {
  border: 2px solid #ffcc00;
  border-radius: 8px;
  padding: 20px;
  font-family: "Anton", sans-serif;
  color: #fbff00;
  text-align: center;
}


.warningText p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 10px;
}

.warningText strong {
  color: #e60101;
}

.warningText hr {
  border: none;
  border-top: 1px dashed #ffcc00;
  margin: 15px 0;
}

.warningText small {
  display: block;
  margin-top: 15px;
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.warningButtonCont {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: auto;
}

.warningButtonCont button {
  width: 40%;
}


.background {
  background-image: url(/img/kaszinobg.jpg);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}

.passContainer {
  position: relative;
  width: 100%;
  padding: 0.8rem 0; /* csak függőleges padding */
  display: flex;
  flex-direction: row;
  align-items: center;
  /* left: -1rem; -- eltávolítva */
}

.passContainer input {
  width: 100%;
}

.loginCont {
  width: 30%;
  min-width: 320px;
  max-width: 400px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid #FFC107; /* letisztult arany */
  border-radius: 16px;
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 2rem 2.5rem;
  color: #FFC107;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.3s ease;
}

.title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  color: #FFC107;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 0.05em;
  text-shadow: none;
}

input {
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
  font-family: 'Montserrat', sans-serif;
  border: 2px solid #444;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #FFF;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  box-shadow: none;
}

.eyeIcon {
  position: absolute;
  left: 85%;
  top: 20%;
  cursor: pointer;
}

input::placeholder {
  color: #FFC107;
  opacity: 0.7;
}

input:focus {
  outline: none;
  border-color: #FFC107;
  background: rgba(255, 255, 255, 0.1);
  color: #FFF;
  box-shadow: none;
}

button {
  width: 100%;
  padding: 0.9rem 1rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: #222;
  background-color: #FFC107;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.2s ease;
  user-select: none;
  margin-top: 0.4rem;
  box-shadow: none;
}

button:hover {
  background-color: #e6ac00;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(1px);
  background-color: #cc9900;
}

/* Mobilra */
@media (max-width: 600px) {
  .loginCont {
    width: 80%;
    padding: 1.5rem 1.2rem 2rem;
  }
  .title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  input {
    font-size: 1.2rem;
    padding: 1rem 0.8rem;
  }
  button {
    font-size: 1.3rem;
    padding: 1.1rem 1.4rem;
  }
}

.changeTxt {
  cursor:pointer;
}

.changeTxt:hover {
  color: #ffd146;
}
</style>