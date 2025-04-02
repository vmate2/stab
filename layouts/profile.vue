<template>
  <main>
    <nav>
      <NavMenu>
        <div class="buttonCont" :class="{ activebtn: $route.path.includes('profile') }"><NuxtLink :to=profilelink><svg style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;" width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="none" stroke="white"/><path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="none" stroke="white"/></svg>Profil</NuxtLink></div>
        <div class="buttonCont" :class="{ activebtn: $route.path.includes('adatok') }"><NuxtLink :to=adatoklink><svg style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;" fill="#FFFFFF" width="20" height="20" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M21,12H7a1,1,0,0,1-1-1V7A1,1,0,0,1,7,6H21a1,1,0,0,1,1,1v4A1,1,0,0,1,21,12ZM8,10H20V7.94H8Z" class="clr-i-outline clr-i-outline-path-1"></path><path d="M21,14.08H7a1,1,0,0,0-1,1V19a1,1,0,0,0,1,1H18.36L22,16.3V15.08A1,1,0,0,0,21,14.08ZM20,18H8V16H20Z" class="clr-i-outline clr-i-outline-path-2"></path><path d="M11.06,31.51v-.06l.32-1.39H4V4h20V14.25L26,12.36V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V31a1,1,0,0,0,1,1h8A3.44,3.44,0,0,1,11.06,31.51Z" class="clr-i-outline clr-i-outline-path-3"></path><path d="M22,19.17l-.78.79A1,1,0,0,0,22,19.17Z" class="clr-i-outline clr-i-outline-path-4"></path><path d="M6,26.94a1,1,0,0,0,1,1h4.84l.3-1.3.13-.55,0-.05H8V24h6.34l2-2H7a1,1,0,0,0-1,1Z" class="clr-i-outline clr-i-outline-path-5"></path><path d="M33.49,16.67,30.12,13.3a1.61,1.61,0,0,0-2.28,0h0L14.13,27.09,13,31.9a1.61,1.61,0,0,0,1.26,1.9,1.55,1.55,0,0,0,.31,0,1.15,1.15,0,0,0,.37,0l4.85-1.07L33.49,19a1.6,1.6,0,0,0,0-2.27ZM18.77,30.91l-3.66.81L16,28.09,26.28,17.7l2.82,2.82ZM30.23,19.39l-2.82-2.82L29,15l2.84,2.84Z" class="clr-i-outline clr-i-outline-path-6"></path><rect x="0" y="0" width="36" height="36" fill-opacity="0"/></svg>Adatok</NuxtLink></div>
        <div class="buttonCont" :class="{ activebtn: $route.path.includes('biztonsag') }"><NuxtLink :to=biztonsaglink><svg style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Biztonság</NuxtLink></div>
        <div class="buttonCont" :class="{ activebtn: $route.path.includes('settings') }"><NuxtLink :to=settingslink><svg style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;" stroke="white" stroke-width="3px" fill="none" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 45.973 45.973"xml:space="preserve"><g><g><path d="M43.454,18.443h-2.437c-0.453-1.766-1.16-3.42-2.082-4.933l1.752-1.756c0.473-0.473,0.733-1.104,0.733-1.774c0-0.669-0.262-1.301-0.733-1.773l-2.92-2.917c-0.947-0.948-2.602-0.947-3.545-0.001l-1.826,1.815C30.9,6.232,29.296,5.56,27.529,5.128V2.52c0-1.383-1.105-2.52-2.488-2.52h-4.128c-1.383,0-2.471,1.137-2.471,2.52v2.607c-1.766,0.431-3.38,1.104-4.878,1.977l-1.825-1.815c-0.946-0.948-2.602-0.947-3.551-0.001L5.27,8.205C4.802,8.672,4.535,9.318,4.535,9.978c0,0.669,0.259,1.299,0.733,1.772l1.752,1.76c-0.921,1.513-1.629,3.167-2.081,4.933H2.501C1.117,18.443,0,19.555,0,20.935v4.125c0,1.384,1.117,2.471,2.501,2.471h2.438c0.452,1.766,1.159,3.43,2.079,4.943l-1.752,1.763c-0.474,0.473-0.734,1.106-0.734,1.776s0.261,1.303,0.734,1.776l2.92,2.919c0.474,0.473,1.103,0.733,1.772,0.733s1.299-0.261,1.773-0.733l1.833-1.816c1.498,0.873,3.112,1.545,4.878,1.978v2.604c0,1.383,1.088,2.498,2.471,2.498h4.128c1.383,0,2.488-1.115,2.488-2.498v-2.605c1.767-0.432,3.371-1.104,4.869-1.977l1.817,1.812c0.474,0.475,1.104,0.735,1.775,0.735c0.67,0,1.301-0.261,1.774-0.733l2.92-2.917c0.473-0.472,0.732-1.103,0.734-1.772c0-0.67-0.262-1.299-0.734-1.773l-1.75-1.77c0.92-1.514,1.627-3.179,2.08-4.943h2.438c1.383,0,2.52-1.087,2.52-2.471v-4.125C45.973,19.555,44.837,18.443,43.454,18.443zM22.976,30.85c-4.378,0-7.928-3.517-7.928-7.852c0-4.338,3.55-7.85,7.928-7.85c4.379,0,7.931,3.512,7.931,7.85C30.906,27.334,27.355,30.85,22.976,30.85z"/></g></g></svg>Beállítások</NuxtLink></div>
        <div class="buttonCont"  @click="logout()"><NuxtLink to="/login"><svg style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;" fill="#FFFFFF" width="20" height="20" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M3.651 16.989h17.326c0.553 0 1-0.448 1-1s-0.447-1-1-1h-17.264l3.617-3.617c0.391-0.39 0.391-1.024 0-1.414s-1.024-0.39-1.414 0l-5.907 6.062 5.907 6.063c0.196 0.195 0.451 0.293 0.707 0.293s0.511-0.098 0.707-0.293c0.391-0.39 0.391-1.023 0-1.414zM29.989 0h-17c-1.105 0-2 0.895-2 2v9h2.013v-7.78c0-0.668 0.542-1.21 1.21-1.21h14.523c0.669 0 1.21 0.542 1.21 1.21l0.032 25.572c0 0.668-0.541 1.21-1.21 1.21h-14.553c-0.668 0-1.21-0.542-1.21-1.21v-7.824l-2.013 0.003v9.030c0 1.105 0.895 2 2 2h16.999c1.105 0 2.001-0.895 2.001-2v-28c-0-1.105-0.896-2-2-2z"></path></svg>Kijelentkezés</NuxtLink></div>
        <div class="buttonCont" ><NuxtLink to="/stab/"><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20" height="20" fill="white" style="margin-left: 10px; padding-right: 10px; position: relative; top: 1px;"><path d="M23.121,9.069,15.536,1.483a5.008,5.008,0,0,0-7.072,0L.879,9.069A2.978,2.978,0,0,0,0,11.19v9.817a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V11.19A2.978,2.978,0,0,0,23.121,9.069ZM15,22.007H9V18.073a3,3,0,0,1,6,0Zm7-1a1,1,0,0,1-1,1H17V18.073a5,5,0,0,0-10,0v3.934H3a1,1,0,0,1-1-1V11.19a1.008,1.008,0,0,1,.293-.707L9.878,2.9a3.008,3.008,0,0,1,4.244,0l7.585,7.586A1.008,1.008,0,0,1,22,11.19Z"/></svg>Főoldal</NuxtLink></div>
      </NavMenu>
    </nav>
    <div class="content">
      <slot />
    </div>
  </main>
  <spinner v-if="!isUser"></spinner>
  <Notification></Notification>
</template>

<script lang="ts" setup>
const activeBtn = ref(1);
const userid = ref('');
const route = useRoute();

const profilelink = ref('');
const adatoklink = ref('');
const biztonsaglink = ref('');
const settingslink = ref('');

const currentUser:User = ref();
const isUser = ref(false);
onMounted(() => {
  if (currentUser.value) {
    isUser.value = true;
  }
})

const {token}= useAuth();

if (token.value) {
  currentUser.value = await User.currentUser(token.value);
  console.log(currentUser.value);
  
  profilelink.value = `/stab/user/${currentUser.value.uuid}/profile`;
  adatoklink.value = `/stab/user/${currentUser.value.uuid}/adatok`;
  biztonsaglink.value = `/stab/user/${currentUser.value.uuid}/biztonsag`;
  settingslink.value = `/stab/user/${currentUser.value.uuid}/settings`;
} else {
  console.error("Token is null or undefined.");
}




const logout = async () => {
  currentUser.value.logout()
}


provide('currentUser', currentUser.value)



</script>

<style>
  nav {
    width: fit-content;
    height: 100%;
    padding-right: 1%;
  }

  @media (max-width: 768px) {
  /* Styles for phones */
    nav {
      width: 0;
    }
}

  main {
    width: 100%;
    height: 100dvh;
    margin: 0;
    offset: 0;
    padding: 0;
    top: 0;
    left: 0;
    display: flex;
  }

  .content {
    width: 100%;
    height: 100%;
  }

  body {
    background: var(--background-primary-color);
  }
</style>