<template>
  <main-frame id="frameProfile">
    <div class="frameProfile" v-if="currentUser">
      <div class="mainTxt">Adatok megváltoztatása</div>
      <form @submit.prevent="setNewData">
        <div class="inputcontainer">
          <input type="text" :placeholder="currentUser.username" v-model="newUsername" autocomplete="username" />
        </div>
        <ul class="checklist">
          <li :class="{ valid: usernameValid }">Felhasználónév: Min. 3 karakter, csak betű/szám/aláhúzás</li>
        </ul>
        <div class="inputcontainer">
          <input :type="passType" placeholder="Jelszó" v-model="newPassword" autocomplete="new-password"/>
          <svg v-if="!passwordHidden" @click="passwordHidden = !passwordHidden; passType = 'password'" width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          <svg v-if="passwordHidden" @click="passwordHidden = !passwordHidden; passType = 'text'" width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div>
        <ul class="checklist">
          <li :class="{ valid: passwordValid.length }"> Jelszó: Min. 8 karakter</li>
          <li :class="{ valid: passwordValid.upper }"> Legalább 1 nagybetű</li>
          <li :class="{ valid: passwordValid.lower }">Legalább 1 kisbetű</li>
          <li :class="{ valid: passwordValid.number }"> Legalább 1 szám</li>
          <li :class="{ valid: passwordValid.special }"> Legalább 1 speciális karakter (@$!%*?&)</li>
        </ul>

        <button type="submit" :disabled="!allValid">Submit</button>
      </form>
    </div>
  </main-frame>
  <spinner v-if="loading"></spinner>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from "vue";

definePageMeta({ layout: 'profile' });

const { $notify } = useNuxtApp();
const newUsername = ref('');
const newPassword = ref('');
const errors = ref<{ username?: string; password?: string }>({});
const currentUser = ref();
currentUser.value = await inject('currentUser');

const passwordHidden = ref(true);
const passType = ref('password');

const loading = ref(false);
// Computed validation rules
const usernameValid = computed(() => /^[a-zA-Z0-9_]{3,}$/.test(newUsername.value));

const passwordValid = computed(() => ({
  length: newPassword.value.length >= 8,
  upper: /[A-Z]/.test(newPassword.value),
  lower: /[a-z]/.test(newPassword.value),
  number: /\d/.test(newPassword.value),
  special: /[@$!%*?&]/.test(newPassword.value),
}));

// Check if all validations pass
const allValid = computed(() =>
  usernameValid.value &&
  passwordValid.value.length &&
  passwordValid.value.upper &&
  passwordValid.value.lower &&
  passwordValid.value.number &&
  passwordValid.value.special
);



const setNewData = async () => {
  try {
    loading.value = true;
  errors.value = {};

  if (!usernameValid.value) {
    errors.value.username = "Csak betűk, számok és aláhúzás, min. 3 karakter!";
  }
  if (!allValid.value) {
    errors.value.password = "Jelszó nem felel meg az összes feltételnek!";
  }
  
  if (Object.keys(errors.value).length > 0) return;

  const response = await $fetch('/api/users/', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${currentUser.value.accessToken}`,
    },
    body: {
      uuid: currentUser.value.uuid,
      username: newUsername.value,
      password: newPassword.value,
    },
  });

  console.log(response);
  

  currentUser.value.username = newUsername.value;
  currentUser.value.password = newPassword.value;
  $notify('Adatok sikeresen frissítve!', 'success');



  } catch (error) {
    console.error('Error setting new data:', error);
    $notify('Hiba történt az adatok frissítésekor!', 'error');
    
  } finally {
    loading.value = false;
  }
  // Reset the form
  newUsername.value = '';
  newPassword.value = '';
  passwordHidden.value = true;
  passType.value = 'password';
  errors.value = {};
  // Update the local storage
  updateUser();
};

const updateUser = async () => {

  localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
  
}
</script>

<style scoped>

.mainTxt {
  font-size: 220%;
  color: white;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  margin-top: 2rem;
}

input {
  border: none;
  margin-top: 3vh;
  padding: 10px;
  border-radius: 10px;
  width: 100%;
  font-size: 1rem;
  line-height: 1.2rem; /* Az egyenletes magasság érdekében */
}

.inputcontainer {
  width: 100%;
  display: flex;
  position: relative;

}

svg {
  position: absolute;
  left: 90%;
  top: 50%;
}

form {
  display: flex;
  flex-direction: column;
}

.error {
  color: red;
  font-size: 0.9rem;
}

.checklist {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  background-color: grey;
  padding: 2%;
  border-radius: 10px;
}

.checklist li {
  color: red;
  font-size: 0.9rem;
  text-shadow: 1px 1px black;
}

.checklist li.valid {
  color: green;
}

button {
  min-height: 10px;
  max-height: 50px;
  height: 3vh;
  padding: 2%;
  border-radius: 10px;
  margin-top: 1rem;
}
</style>
