<template>
  <main>
    <nav>
      <NavMenu>
        <div class="buttonCont" :class="{ activebtn: isStabActive}"><NuxtLink to="/stab/" ><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20" height="20" fill="white" style="margin-left: 10px; padding-right: 10px; position: relative; top: 1px;"><path d="M23.121,9.069,15.536,1.483a5.008,5.008,0,0,0-7.072,0L.879,9.069A2.978,2.978,0,0,0,0,11.19v9.817a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V11.19A2.978,2.978,0,0,0,23.121,9.069ZM15,22.007H9V18.073a3,3,0,0,1,6,0Zm7-1a1,1,0,0,1-1,1H17V18.073a5,5,0,0,0-10,0v3.934H3a1,1,0,0,1-1-1V11.19a1.008,1.008,0,0,1,.293-.707L9.878,2.9a3.008,3.008,0,0,1,4.244,0l7.585,7.586A1.008,1.008,0,0,1,22,11.19Z"/></svg>Főoldal</NuxtLink></div>
        <!--<div class="buttonCont" :class="{ activebtn: $route.path == '/stab/uzenofal'}"><NuxtLink to="/stab/uzenofal"><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20" height="20" fill="white" style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;"><path d="M23.119.882a2.966,2.966,0,0,0-2.8-.8l-16,3.37a4.995,4.995,0,0,0-2.853,8.481L3.184,13.65a1,1,0,0,1,.293.708v3.168a2.965,2.965,0,0,0,.3,1.285l-.008.007.026.026A3,3,0,0,0,5.157,20.2l.026.026.007-.008a2.965,2.965,0,0,0,1.285.3H9.643a1,1,0,0,1,.707.292l1.717,1.717A4.963,4.963,0,0,0,15.587,24a5.049,5.049,0,0,0,1.605-.264,4.933,4.933,0,0,0,3.344-3.986L23.911,3.715A2.975,2.975,0,0,0,23.119.882ZM4.6,12.238,2.881,10.521a2.94,2.94,0,0,1-.722-3.074,2.978,2.978,0,0,1,2.5-2.026L20.5,2.086,5.475,17.113V14.358A2.978,2.978,0,0,0,4.6,12.238Zm13.971,7.17a3,3,0,0,1-5.089,1.712L11.762,19.4a2.978,2.978,0,0,0-2.119-.878H6.888L21.915,3.5Z"/></svg>Üzenőfal</NuxtLink></div>-->
        <div class="buttonCont" :class="{ activebtn: $route.path.startsWith('/stab/diszlet') }"><NuxtLink to="/stab/diszlet"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20" height="20" fill="white" style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;"><path d="m23.278,10.922l-4.723-1.945,3.206-4.808c.376-.568.305-1.273-.177-1.754s-1.188-.553-1.756-.177l-4.812,3.194-1.94-4.71c-.181-.438-.604-.722-1.077-.722s-.896.283-1.077.722l-1.94,4.71-4.813-3.194c-.568-.375-1.274-.303-1.755.178-.481.481-.553,1.187-.176,1.756l3.205,4.807-4.723,1.945c-.438.18-.722.604-.722,1.078s.283.897.722,1.078l4.723,1.945-3.206,4.808c-.376.568-.305,1.273.177,1.754.275.276.624.417.979.417.266,0,.534-.079.777-.24l4.812-3.194,1.94,4.71c.181.438.604.722,1.077.722s.896-.283,1.077-.722l1.94-4.71,4.813,3.194c.243.161.511.239.775.239.354,0,.704-.141.979-.417.481-.481.553-1.187.176-1.756l-3.205-4.807,4.723-1.945c.438-.18.722-.604.722-1.078s-.283-.897-.722-1.078Zm-2.897-7.851c.246-.164.443-.004.497.051.053.053.215.247.051.494l-3.316,4.973-1.56-.642-.648-1.574,4.976-3.302ZM3.072,3.618c-.165-.249-.003-.442.05-.496.053-.055.248-.213.496-.051l4.977,3.303-.648,1.574-1.56.642L3.072,3.618Zm.547,17.311c-.248.162-.444.003-.497-.051-.053-.053-.215-.247-.051-.494l3.316-4.973,1.56.642.648,1.574-4.976,3.302Zm17.309-.546c.165.249.003.442-.05.496-.054.054-.25.212-.496.051l-4.977-3.303.648-1.574,1.56-.642,3.315,4.972Zm1.97-8.229l-7.418,3.055c-.123.051-.221.149-.271.272l-3.055,7.418c-.07.169-.236.169-.307,0l-3.055-7.418c-.051-.123-.148-.221-.271-.272l-7.418-3.055c-.085-.035-.103-.103-.103-.153s.018-.118.103-.153l7.418-3.055c.123-.051.221-.149.271-.272l3.055-7.418c.035-.084.103-.103.153-.103s.118.018.153.103l3.055,7.418c.051.123.148.221.271.272l7.418,3.055c.085.035.103.103.103.153s-.018.118-.103.153Z"/></svg>Díszlet</NuxtLink></div>
        <div class="buttonCont" :class="{ activebtn: $route.path.startsWith('/stab/szponzorok') }"><NuxtLink to="/stab/szponzorok"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20" height="20" fill="white" style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;"><path d="m24,6v10.101c0,2.137-.832,4.146-2.343,5.657l-1.95,1.95c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l1.95-1.95c1.133-1.133,1.757-2.64,1.757-4.243V6c0-.551-.449-1-1-1s-1,.449-1,1c0,0-.012,8.043-.013,8.067-.015.662-.239,1.32-.688,1.856l-2.578,2.684c-.196.205-.458.307-.721.307-.25,0-.499-.093-.693-.279-.398-.383-.411-1.016-.028-1.414l2.533-2.634c.13-.157.191-.368.188-.585,0,0,0-.001,0-.002v-.044c-.013-.221-.095-.446-.254-.624-.367-.409-.998-.444-1.406-.077l-3.163,2.911c.53,1.001.824,2.124.824,3.276v3.559c0,.552-.448,1-1,1s-1-.448-1-1v-3.559c0-1.395-.588-2.735-1.615-3.68l-2.734-2.516c-.398-.357-1.03-.324-1.397.086-.328.367-.337.928-.021,1.305l2.57,2.671c.383.398.371,1.031-.028,1.414-.396.383-1.031.372-1.414-.028l-2.616-2.721c-.46-.547-.693-1.2-.723-1.854-.005-.04-.024-8.118-.024-8.118,0-.551-.449-1-1-1s-1,.449-1,1v10.101c0,1.603.624,3.109,1.757,4.243l1.95,1.95c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-1.95-1.95c-1.511-1.511-2.343-3.52-2.343-5.657V6c0-1.654,1.346-3,3-3s3,1.346,3,3v5.186c.999-.352,2.152-.176,2.996.579l2.744,2.525c.087.08.164.168.247.252l3.008-2.768c.851-.762,2.006-.939,3.005-.587v-5.186c0-1.654,1.346-3,3-3s3,1.346,3,3ZM7,3.2c0-1.765,1.346-3.2,3-3.2.782,0,1.477.27,2,.727.523-.457,1.218-.727,2-.727,1.654,0,3,1.436,3,3.2,0,2.004-2.042,4.064-3.754,5.438-.361.29-.803.435-1.246.435s-.885-.145-1.247-.436c-1.712-1.374-3.753-3.434-3.753-5.438Zm2,0c0,.904,1.152,2.391,3.006,3.879,1.842-1.488,2.994-2.975,2.994-3.879,0-.662-.449-1.2-1-1.2-.461,0-1,.262-1,1,0,.552-.448,1-1,1s-1-.448-1-1c0-.738-.539-1-1-1-.551,0-1,.539-1,1.2Z"/></svg>Szponzorok</NuxtLink></div>
        <div class="buttonCont" :class="{ activebtn: $route.path.startsWith('/stab/penzugy') }"><NuxtLink to="/stab/penzugy"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="22" height="22" fill="white" style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;"><path d="M20,3H8c-2.21,0-4,1.79-4,4v6c0,2.21,1.79,4,4,4h12c2.21,0,4-1.79,4-4V7c0-2.21-1.79-4-4-4Zm2,10c0,1.1-.9,2-2,2H8c-1.1,0-2-.9-2-2V7c0-1.1,.9-2,2-2h12c1.1,0,2,.9,2,2v6Zm-3,7c0,.55-.45,1-1,1H5c-2.76,0-5-2.24-5-5v-7c0-.55,.45-1,1-1s1,.45,1,1v7c0,1.65,1.35,3,3,3h13c.55,0,1,.45,1,1ZM14,7c-1.65,0-3,1.35-3,3s1.35,3,3,3,3-1.35,3-3-1.35-3-3-3Zm0,4c-.55,0-1-.45-1-1s.45-1,1-1,1,.45,1,1-.45,1-1,1Z"/></svg>Pénzügy</NuxtLink></div>
        <div class="buttonCont" :class="{ activebtn: $route.path.startsWith('/stab/tagok') }"><NuxtLink to="/stab/tagok"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20" height="20" fill="white" style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;"><path d="M12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,12,10Zm6,13A6,6,0,0,0,6,23a1,1,0,0,0,2,0,4,4,0,0,1,8,0,1,1,0,0,0,2,0ZM18,8a4,4,0,1,1,4-4A4,4,0,0,1,18,8Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,18,2Zm6,13a6.006,6.006,0,0,0-6-6,1,1,0,0,0,0,2,4,4,0,0,1,4,4,1,1,0,0,0,2,0ZM6,8a4,4,0,1,1,4-4A4,4,0,0,1,6,8ZM6,2A2,2,0,1,0,8,4,2,2,0,0,0,6,2ZM2,15a4,4,0,0,1,4-4A1,1,0,0,0,6,9a6.006,6.006,0,0,0-6,6,1,1,0,0,0,2,0Z"/></svg>Tagok</NuxtLink></div>
        <div class="buttonCont" :class="{ activebtn: $route.path.startsWith('/stab/polorendeles') }"><NuxtLink to="/stab/polorendeles"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;" stroke="white"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 7L6 4H9C9 4.39397 9.0776 4.78407 9.22836 5.14805C9.37913 5.51203 9.6001 5.84274 9.87868 6.12132C10.1573 6.3999 10.488 6.62087 10.8519 6.77164C11.2159 6.9224 11.606 7 12 7C12.394 7 12.7841 6.9224 13.1481 6.77164C13.512 6.62087 13.8427 6.3999 14.1213 6.12132C14.3999 5.84274 14.6209 5.51203 14.7716 5.14805C14.9224 4.78407 15 4.39397 15 4H18L21 7L20.5785 11.2152C20.542 11.5801 20.1382 11.7829 19.8237 11.5942L18 10.5V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V10.5L4.17629 11.5942C3.86184 11.7829 3.45801 11.5801 3.42152 11.2152L3 7Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>Pólórendelés</NuxtLink></div>
        <div class="buttonCont" :class="{ activebtn: $route.path.startsWith('/stab/garatools') }"><NuxtLink to="/stab/garatools"><svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left: 10px; padding-right: 10px; position: relative; top: 2px;" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="icomoon-ignore"> </g> <path d="M29.532 25.76l-5.655-5.655 0.754-0.754-0.754-0.754-2.261 2.261-3.771-3.77 4.53-4.532c0.603 0.215 1.234 0.324 1.882 0.324 1.493 0 2.897-0.582 3.954-1.637 1.63-1.631 2.092-4.054 1.178-6.174l-0.311-0.722-2.43 2.43-1.956 0.027 0.026-1.866 2.477-2.477-0.72-0.312c-0.706-0.306-1.457-0.461-2.229-0.461-1.494 0-2.897 0.582-3.952 1.637-1.546 1.545-2.043 3.802-1.311 5.84l-4.529 4.529-6.409-6.408 0.754-0.754-4.145-4.146-2.264 2.261 4.147 4.147 0.753-0.754 6.409 6.408-4.529 4.529c-0.605-0.217-1.239-0.326-1.888-0.326-1.493 0-2.897 0.582-3.953 1.637-1.633 1.632-2.095 4.059-1.176 6.181l0.312 0.72 2.477-2.477 1.865-0.025-0.027 1.956-2.43 2.43 0.722 0.311c0.704 0.303 1.452 0.458 2.221 0.458 1.494 0 2.897-0.581 3.952-1.636 1.544-1.544 2.041-3.799 1.314-5.833l4.532-4.532 3.771 3.769-2.263 2.263 0.754 0.754 0.754-0.754 5.654 5.654c0.503 0.504 1.174 0.781 1.885 0.781s1.381-0.277 1.885-0.781c1.039-1.039 1.039-2.73-0-3.769zM3.899 4.648l0.754-0.753 2.638 2.638-0.754 0.754-2.639-2.639zM11.448 22.456c0.739 1.716 0.364 3.679-0.955 4.999-0.854 0.854-1.989 1.324-3.198 1.324-0.347 0-0.689-0.039-1.021-0.116l1.569-1.569 0.047-3.485-3.394 0.046-1.619 1.619c-0.356-1.51 0.081-3.103 1.208-4.229 0.854-0.854 1.99-1.325 3.199-1.325 0.626 0 1.233 0.125 1.806 0.373l0.333 0.144 10.819-10.819-0.144-0.333c-0.744-1.719-0.37-3.682 0.952-5.004 0.854-0.854 1.99-1.325 3.198-1.325 0.35 0 0.695 0.040 1.030 0.117l-1.618 1.618-0.047 3.394 3.485-0.047 1.57-1.57c0.352 1.507-0.086 3.097-1.209 4.221-0.855 0.854-1.991 1.325-3.2 1.325-0.624 0-1.23-0.125-1.801-0.371l-0.332-0.143-10.821 10.823 0.143 0.332zM28.779 28.775c-0.302 0.302-0.704 0.469-1.131 0.469s-0.829-0.167-1.131-0.469l-5.654-5.654 2.262-2.262 5.655 5.655c0.624 0.624 0.624 1.638 0.001 2.261z" fill="#FFFFFF"> </path> </g></svg>GaraTools</NuxtLink></div>
      </NavMenu>
    </nav>
    <div class="content">
      <client-only>
        <Profile v-if="currentUser" :profile="{
          name: currentUser?.name ?? '',
          uuid: currentUser?.uuid ?? ''
        }"/>
      </client-only>
      <slot />
    </div>
  </main>
  <Notification />
  <Dialog />
  <Spinner v-show="!currentUser" />
</template>

<script lang="ts" setup>
const { $notify } = useNuxtApp();
const { $showDialog } = useNuxtApp();
import NavMenu from '~/components/navMenu.vue';
import Profile from '~/components/profile.vue';
import { provide, ref } from 'vue';


type CurrentUserType = Partial<User> | null;
const currentUser = ref<CurrentUserType>(null);
const route = ref(useRoute());

const isStabActive = computed(() => route.value.path === '/stab' || route.value.path === '/stab/');

const path = route.value.fullPath;                //                                          
let trimmedpath = path.replace('/stab/', '');     //                                          
                                                  //                                          
watch(                                            // Makes the document tile be the page title
  () => route.value.fullPath,                     //                                          
  (newPath) => {                                  //                                          
    trimmedpath = newPath.replace('/stab/', '');  //                                          
  }                                               //                                          
);                                                //                                          

useHead({
  title: `stab - ${trimmedpath || 'Főoldal'}`
})



const { user, token } = useAuth() as { user: Ref<LocalUser | null>, token: Ref<string | null> };

import {User} from "@/composables/user"
console.log(token.value);



let hasFetchedUser = false;

const fetchCurrentUser = async () => {
  console.log(!token.value || hasFetchedUser);
  
  if (!token.value || hasFetchedUser) return;
  hasFetchedUser = true;

  try {
    const currUser = await User.currentUser(token.value);
    console.log(currUser);
    
    if (currUser) {
      currentUser.value = currUser;
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};




interface LocalUser {
  exp: number,
  iat: number,
  userId: number,
  username: string
};

let watchId: number | null = null


onMounted(async () => {
  if (!user.value) {
    navigateTo('/login'); //ONLINE MODE
  }
  if (token.value && !currentUser.value) {
    currentUser.value = await User.currentUser(token.value);
  }

  // Handle login from query param and localStorage user setup
  const fromLogin = route.value.query.fromlogin;
  if (fromLogin === 'true' && !initiated) {
    initiated = true;
    log.info({
      title: 'New login',
      type: 'login',
      message: 'A felhasználó sikeresen bejelentkezett.',
    });

    if (!localStorage.getItem('currentUser')) {
      try {
        if (!currentUser.value && token.value) {
          console.log('Fetching current user from server...');
          currentUser.value = await User.currentUser(token.value);
        }
        console.log('CURRENTUSER: ', currentUser.value);
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
        $notify("Sikeresen bejelentkeztél!", "success");
      } catch (error) {
        $notify("Engedélyezd a böngészőben a helyi tárolást!", "warning");
      }
    }
    // Remove the query param so it doesn't trigger again
    const query = { ...route.value.query };
    delete query.fromlogin;
    navigateTo({ path: route.value.path, query }, { replace: true });
  } else {
    if (!localStorage.getItem('currentUser') || localStorage.getItem('currentUser') === 'null') {
      try {
        if (!currentUser.value && token.value) {
          console.log('Fetching current user from server...');
          currentUser.value = await User.currentUser(token.value);
        }
        console.log("setting currentUser to localStorage: ", currentUser.value);
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
      } catch (error) {
        $notify("Engedélyezd a böngészőben a helyi tárolást!", "warning");
      }
    } else {
      console.log('Current user already exists in localStorage:', localStorage.getItem('currentUser'));
    }
  }

    const L = await import('leaflet')
    watchId = navigator.geolocation.watchPosition(
      (pos) => {        
        const { latitude, longitude } = pos.coords
        const data = {
          lat: latitude,
          lon: longitude,
          username: currentUser.value?.username || '',
          userID: currentUser.value?.uuid || ''
        }

        $fetch('/api/setlocation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token.value}`
          },
          body: data
        });
      }
    )

    startLocationTracking()


  
});



const { data, status, error, refresh } = useFetch('/api', {
  method: 'GET',
  headers: token.value ? { token: token.value } : undefined, // Fix: Avoid `null` in headers
})




// Initialize layoutData as empty, so it's available immediately
const layoutData = ref<{
  users: Array<{ name: string; uuid: string; post: string; id: number; school: string | null; paidcash: number | null; email: string; phone: string; city: string | null }>;
  sponsors: Array<{ name: string; id: number; email: string | null; phone: string | null; contact: string | null; success: string; desc: string | null }>;
  polorendeles: Array<{ name: string; id: number; phone: string; felirat: string | null; paid: boolean }>;
}>({
  users: [],
  sponsors: [],
  polorendeles: []
});

provide('layoutData', layoutData);
// Update layoutData when data changes
watchEffect(() => {
  if (data.value && user.value) {
    
    
    layoutData.value = {
      users: data.value.users || [],
      sponsors: (data.value.sponsors || []).map((s: any) => ({
        ...s,
        success: s.status ?? s.success ?? '',
      })),
      polorendeles: data.value.polorendeles || []
    };
  }
  
});



// Handle errors separately


watchEffect(async () => {
  if (error.value) {
    console.error('Error fetching data:', error.value);
    if (error.value.statusCode === 401 && useCookie('refreshToken').value) {
      const response = await $fetch('/api/genNewAccessToken', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${useCookie('refreshToken').value}`,
        }
      })
      if (response) {
        token.value = response.accessToken;
        await refresh(); // Refresh the data after getting a new token
      } else {
        alert('Hiba történt a frissítés során!');
      }
    } else {
    alert(error.value.statusMessage);
    }
  }
});


      const { sendMessage, onMessage, socket} = useWebSocket('ws://localhost:3001')
      console.log('socket', socket);
      onMessage((event) => {
        console.log('Received from server:', event.data)
      })


let initiated = false;
if (import.meta.client) {


watchEffect(async() => {
  
  const fromLogin = route.value.query.fromlogin;

  if (fromLogin === 'true' && !initiated) {
    initiated = true;
    log.info({
      title: 'New login',
      type: 'login',
      message: 'A felhasználó sikeresen bejelentkezett.',
    });


  if (!localStorage.getItem('currentUser')) {
    try {
      if (!currentUser.value) {
        console.log('Fetching current user from server...');
        
        currentUser.value = await User.currentUser(token.value);
      }
      console.log('CURRENTUSER: ', currentUser.value);
          localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
      $notify("Sikeresen bejelentkeztél!", "success");
    } catch (error) {
      $notify("Engedélyezd a böngészőben a helyi tárolást!", "warning");
    }

    
  }
    // Ne logolj többször!
    const query = { ...route.value.query };
    delete query.fromlogin;

    // Töröljük a query paramétert, hogy ne triggerelje újra
    navigateTo({ path: route.value.path, query }, { replace: true });
  } else {
    onMounted(async() => {
      if (!localStorage.getItem('currentUser') || localStorage.getItem('currentUser') === 'null') {
        try {
          if (!currentUser.value) {
            console.log('Fetching current user from server...');

            currentUser.value = await User.currentUser(token.value);
          }
          console.log("setting currentUser to localStorage: ", currentUser.value);
          localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
        } catch (error) {
          $notify("Engedélyezd a böngészőben a helyi tárolást!", "warning");
        }
      } else {
        console.log('Current user already exists in localStorage:', localStorage.getItem('currentUser'));
      }
    });

  }
});
}

async function startLocationTracking() {
  setInterval(() => {
    watchId = navigator.geolocation.watchPosition(
      (pos) => {        
        const { latitude, longitude } = pos.coords
        const data = {
          lat: latitude,
          lon: longitude,
          username: currentUser.value?.username || '',
          userID: currentUser.value?.uuid || ''
        }

        $fetch('/api/setlocation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token.value}`
          },
          body: data
        });
      }
    )
  }, 5000*60);
}




</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

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
    min-height: 100vh;
    padding: 1vh;
    offset: 0;
    top: 0;
    left: 0;
    display: flex;
    background-color: var(--background-primary-color);
  }

  .content {
    width: 100%;
    height: 100%;
  }

  </style>