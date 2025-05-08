<template>
  <div class="notification-wrapper">
    <div
      v-for="(notif, index) in notifications"
      :key="index"
      class="container"
      :class="{ slideIn: notif.shouldDisplay, slideOut: !notif.show, blue: notif.type === 'info', yellow: notif.type === 'warning', red: notif.type === 'error', green: notif.type === 'success' }"
    >
      <svg v-if="notif.type === 'info'" width="7vh" height="7vh" viewBox="-2.4 -2.4 28.80 28.80" fill="none">
        <g id="SVGRepo_iconCarrier">
          <g id="Warning / Info">
            <path id="Vector" d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
          </g>
        </g>
      </svg>
      <svg v-else-if="notif.type === 'warning'" width="7vh" height="7vh" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="2"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="17" r="1" fill="#ffffff"></circle> <path d="M12 10L12 14" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      <svg v-else-if="notif.type === 'error'" width="7vh" height="7vh" viewBox="-2.4 -2.4 28.80 28.80" fill="none">
        <g id="SVGRepo_iconCarrier">
          <g id="Warning / Info">
            <path id="Vector" d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
          </g>
        </g>
        </svg>
        <svg v-else-if="notif.type === 'success'" width="7vh" height="7vh"  fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="success" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.4"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" d="M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z M15.2928932,8.29289322 L10,13.5857864 L8.70710678,12.2928932 C8.31658249,11.9023689 7.68341751,11.9023689 7.29289322,12.2928932 C6.90236893,12.6834175 6.90236893,13.3165825 7.29289322,13.7071068 L9.29289322,15.7071068 C9.68341751,16.0976311 10.3165825,16.0976311 10.7071068,15.7071068 L16.7071068,9.70710678 C17.0976311,9.31658249 17.0976311,8.68341751 16.7071068,8.29289322 C16.3165825,7.90236893 15.6834175,7.90236893 15.2928932,8.29289322 Z"></path> </g></svg>
      <div class="message">{{ notif.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const audioMap = ref<{ [key: string]: HTMLAudioElement }>({});

// Reactive state for notifications
const notifications = useState<{ message: string; type: string; show: boolean; shouldDisplay: boolean }[]>('notifications');

// Watch for changes in notifications and set shouldDisplay based on show value with a delay
watch(
  () => notifications.value,
  (newNotifications, oldNotifications) => {
    newNotifications.forEach((notif, index) => {
      // Csak akkor játsszon le hangot, ha egy új elem került bele vagy show true-ra váltott
      console.log('triggered 1');
      console.log(typeof window !== 'undefined');
      
      
      if (
        typeof window !== 'undefined' &&
        notif.show
      ) {
        
        const config =  JSON.parse(localStorage.getItem('currentUser')).config;
        console.log(config.notificationsound);
        
        if (config.notificationsound) {
          console.log('Notification sound is enabled in user settings.');
          
          const audio = audioMap.value[notif.type] ?? new Audio(`/sounds/${notif.type}.mp3`);
          audio.currentTime = 0;
          audio.volume = 0.1; // Set volume to 50%
          audio.play().catch(err => console.warn('Autoplay prevented:', err));
        } else {
          console.log('Notification sound is disabled in user settings.');
        }
      }

      // Animáció trigger (késleltetve)
      setTimeout(() => {
        notif.shouldDisplay = notif.show;
      }, 150);
    });
  },
  { immediate: true }
);

onMounted(() => {
  audioMap.value = {
    info: new Audio('/sounds/info.mp3'),
    warning: new Audio('/sounds/warning.mp3'),
    error: new Audio('/sounds/error.mp3'),
    success: new Audio('/sounds/success.mp3'),
  };

  // Az első kattintás aktiválja a hangokat (böngésző policy miatt)
  window.addEventListener('click', () => {
    setupAudio();
  }, { once: true });
});



function setupAudio() {
  Object.values(audioMap.value).forEach(audio => {
    if (audio instanceof HTMLAudioElement) {
      audio.load(); // vagy audio.play().then(() => audio.pause())
    }
  });
}


console.log('Rendering notifications:', notifications.value); // Debugging
</script>

<style scoped>
.blue {
  background: linear-gradient(145deg, rgb(75, 155, 255), rgb(30, 100, 200));
}

.yellow {
  background: linear-gradient(145deg, rgb(255, 200, 75), rgb(200, 150, 30));
}

.red {
  background: linear-gradient(145deg, rgb(255, 75, 75), rgb(200, 30, 30));
}

.green {
  background: linear-gradient(145deg, rgb(75, 255, 75), rgb(30, 200, 30));
}

.notification-wrapper {
  position: absolute;
  top: 4vh;
  right: 2vw;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  z-index: 1000;
  left: auto;
}

.container {
  width: 15vw;
  height: 7vh;
  color: white;
  border-radius: 10px;
  transition: all 0.5s ease-in-out;
  display: flex;
  align-items: center;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3), inset -2px -2px 5px rgba(255, 255, 255, 0.2);
  opacity: 0; /* Initially hidden */
  transform: translateX(400px); /* Initially out of view */
}

.slideIn {
  opacity: 1; /* Make the notification visible */
  transform: translateX(0px); /* Initially out of view */
}

.slideOut {
  opacity: 0; /* Fade out */
  transform: translateX(400px); /* Move it out of view */
}

.message {
  font-family: 'Poppins', monospace;
  color: white;
  margin-left: 1vw;
}
</style>
