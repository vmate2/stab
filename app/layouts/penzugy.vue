<template>
  <main>
    <title>Stáb - pénzügy</title>
    <nav>
      <NavMenu>
        <div class="buttonCont" :class="{ activebtn: $route.path == '/stab/penzugy/' || $route.path == '/stab/penzugy'}"><NuxtLink to="/stab/penzugy" class="Link"><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20" height="20" fill="white" style="margin-left: 10px; padding-right: 10px; position: relative; top: 1px;"><path d="M23.121,9.069,15.536,1.483a5.008,5.008,0,0,0-7.072,0L.879,9.069A2.978,2.978,0,0,0,0,11.19v9.817a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V11.19A2.978,2.978,0,0,0,23.121,9.069ZM15,22.007H9V18.073a3,3,0,0,1,6,0Zm7-1a1,1,0,0,1-1,1H17V18.073a5,5,0,0,0-10,0v3.934H3a1,1,0,0,1-1-1V11.19a1.008,1.008,0,0,1,.293-.707L9.878,2.9a3.008,3.008,0,0,1,4.244,0l7.585,7.586A1.008,1.008,0,0,1,22,11.19Z"/></svg>Főoldal</NuxtLink></div>
        <div @mouseover="genTransactionID" class="buttonCont" :class="{ activebtn: $route.path == '/stab/penzugy/new-transaction/' || $route.path == '/stab/penzugy/new-transaction'}"><NuxtLink :to="{ path: './new-transaction', query: { id: transactionID } }" class="Link"><svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" style="margin-left: 10px; padding-right: 10px; position: relative; top: 1px;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="Layer_7" data-name="Layer 7"> <g> <path d="M34.3,20.1h0a6.7,6.7,0,0,1-4.1-1.3,2,2,0,0,0-2.8.6,1.8,1.8,0,0,0,.3,2.6A10.9,10.9,0,0,0,32,23.8V26a2,2,0,0,0,4,0V23.8a6.3,6.3,0,0,0,3-1.3,4.9,4.9,0,0,0,2-4h0c0-3.7-3.4-4.9-6.3-5.5s-3.5-1.3-3.5-1.8.2-.6.5-.9a3.4,3.4,0,0,1,1.8-.4,6.3,6.3,0,0,1,3.3.9,1.8,1.8,0,0,0,2.7-.5,1.9,1.9,0,0,0-.4-2.8A9.1,9.1,0,0,0,36,6.3V4a2,2,0,0,0-4,0V6.2c-3,.5-5,2.5-5,5.2s3.3,4.9,6.5,5.5,3.3,1.3,3.3,1.8S35.7,20.1,34.3,20.1Z"></path> <path d="M42.2,31.7a5.2,5.2,0,0,0-4-1.1l-9.9,1.8a4.5,4.5,0,0,0-1.4-3.3L19.8,22H5a2,2,0,0,0-2,2v9a2,2,0,0,0,2,2H8.3l11.2,9.1,20.4-3.7a5,5,0,0,0,2.3-8.7Zm-3,4.8L20.5,39.9,10,31.2V26h8.2l5.9,5.9a.8.8,0,0,1-1.2,1.2l-3.5-3.5a2,2,0,0,0-2.8,2.8l3.5,3.5a4.5,4.5,0,0,0,3.4,1.4,5.7,5.7,0,0,0,1.8-.3h0l13.6-2.4a1.1,1.1,0,0,1,.8.2.9.9,0,0,1,.3.7A1,1,0,0,1,39.2,36.5Z"></path> </g> </g> </g> </g></svg>Új tranzakció</NuxtLink></div>
        <div class="buttonCont" :class="{ activebtn: $route.path == '/stab/penzugy/analizacio/' || $route.path == '/stab/penzugy/analizacio'}"><NuxtLink to="/stab/penzugy/analizacio" class="Link"><svg viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="white" style="margin-left: 10px; padding-right: 10px; position: relative; top: 1px;"><g id="SVGRepo_bgCarrier" stroke-width="0" stroke="white"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="white"></g><g id="SVGRepo_iconCarrier" stroke="white"> <path stroke="white" d="M8 5.00005C7.01165 5.00082 6.49359 5.01338 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.51984 5 7.07989 5 8.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V8.2C19 7.07989 19 6.51984 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5064 5.01338 16.9884 5.00082 16 5.00005M8 5.00005V7H16V5.00005M8 5.00005V4.70711C8 4.25435 8.17986 3.82014 8.5 3.5C8.82014 3.17986 9.25435 3 9.70711 3H14.2929C14.7456 3 15.1799 3.17986 15.5 3.5C15.8201 3.82014 16 4.25435 16 4.70711V5.00005M12 15H9M15 11H9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>Analizáció</NuxtLink></div>
      </NavMenu>
    </nav>
    <div class="content">
      <slot />
    </div>
  </main>
  <Notification />
  <Dialog />
</template>

<script lang="ts" setup>

const transactionID = ref<string | undefined>(undefined);

const genTransactionID = () => {
  const date = new Date();
  const formattedDate = date
    .toLocaleString('en-US', {
      month: 'numeric',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })
    .replaceAll('/', '')
    .replaceAll(',', '')
    .replaceAll(' ', '')
    .replaceAll(':', '');
  const id = formattedDate + Math.floor(10000 + Math.random() * 90000);
  transactionID.value = id;
  return 0;
};



</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  nav {
    width: fit-content;
    height: 100%;
    padding-right: 1%;
  }

  @media (max-width: 768px) {
    nav {
      width: 0;
    }
  }

  main {
    width: 100%;
    height: 100dvh;
    display: flex;
    background-color: var(--background-primary-color);
  }

  .content {
    width: 100%;
    height: 100%;
    display: block;
    padding: 1%;
  }

  @media screen and (max-width: 768px) {
    .content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2vh;
      padding: 0 5vw;
      margin: 0;
    }
    
  }
</style>