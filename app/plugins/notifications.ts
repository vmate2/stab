export default defineNuxtPlugin((nuxtApp) => {
    const notifications = useState<{ message: string; type: string; show: boolean }[]>('notifications', () => []);
  
    const displayNotification = (message: string, type: string = 'info') => {
      console.log('Adding notification:', message);
      
      const newNotif = { message, type, show: true };
      notifications.value.push(newNotif);
      
      // Force Vue to detect changes
      notifications.value = [...notifications.value];
  
      setTimeout(() => {
        newNotif.show = false;
        notifications.value = [...notifications.value]; // Trigger reactivity again
  
        setTimeout(() => {
          notifications.value.shift();
          notifications.value = [...notifications.value]; // Ensure Vue updates the state
        }, 500);
      }, 5000);
    };
  
    nuxtApp.provide('notify', displayNotification);
  });
  