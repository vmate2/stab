import { useWebSocket } from '@/composables/websocket'

const {sendMessage, onMessage, socket} = useWebSocket()

export const log = {
  info: async (message: Record<string, any> | string) => {
    try {
      const { user } = useAuth();
      async function waitForUser(timeout = 5000): Promise<void> {
        return new Promise((resolve, reject) => {
          const start = Date.now();
          const interval = setInterval(() => {
            if (user.value) {
              clearInterval(interval);
              resolve();
            } else if (Date.now() - start > timeout) {
              clearInterval(interval);
              reject(new Error('User data not initialized in time'));
            }
          }, 100);
        });
      }
      await waitForUser();
      const ip = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip);
      const userVal: any = user.value;
      if (typeof message === 'object' && message !== null) {
        (message as Record<string, any>).level = 'info';
        (message as Record<string, any>).ip = ip;
        (message as Record<string, any>).username = userVal?.username || userVal?.payload?.username;
        (message as Record<string, any>).userId = userVal?.uuid || userVal?.payload?.userId;
      } else {
        message = JSON.parse(message);
        (message as Record<string, any>).level = 'info';
        (message as Record<string, any>).ip = ip;
        (message as Record<string, any>).username = userVal?.username || userVal?.payload?.username;
        (message as Record<string, any>).userId = userVal?.uuid || userVal?.payload?.userId;
      }
      message = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
      const msg = typeof message === 'object' ? JSON.stringify(message, null, 2) : message + '';
      sendMessage(msg);
    } catch (error) {
      console.error('Error in log.info:', error);
      return;
    }
  },
  modification: async (message: Record<string, any> | string) => {
    try {
      const { user } = useAuth();
      async function waitForUser(timeout = 5000): Promise<void> {
        return new Promise((resolve, reject) => {
          const start = Date.now();
          const interval = setInterval(() => {
            if (user.value) {
              clearInterval(interval);
              resolve();
            } else if (Date.now() - start > timeout) {
              clearInterval(interval);
              reject(new Error('User data not initialized in time'));
            }
          }, 100);
        });
      }
      await waitForUser();
      const ip = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip);
      const userVal: any = user.value;
      if (typeof message === 'object' && message !== null) {
        (message as Record<string, any>).level = 'modification';
        (message as Record<string, any>).ip = ip;
        (message as Record<string, any>).username = userVal?.username || userVal?.payload?.username;
        (message as Record<string, any>).userId = userVal?.uuid || userVal?.payload?.userId;
      } else {
        message = JSON.parse(message);
        (message as Record<string, any>).level = 'modification';
        (message as Record<string, any>).ip = ip;
        (message as Record<string, any>).username = userVal?.username || userVal?.payload?.username;
        (message as Record<string, any>).userId = userVal?.uuid || userVal?.payload?.userId;
      }
      message = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
      const msg = typeof message === 'object' ? JSON.stringify(message, null, 2) : message + '';
      sendMessage(msg);
    } catch (error) {
      console.error('Error in log.modification:', error);
      return;
    }
  },
  warning: async (message: Record<string, any> | string) => {
    try {
      const { user } = useAuth();
      async function waitForUser(timeout = 5000): Promise<void> {
        return new Promise((resolve, reject) => {
          const start = Date.now();
          const interval = setInterval(() => {
            if (user.value) {
              clearInterval(interval);
              resolve();
            } else if (Date.now() - start > timeout) {
              clearInterval(interval);
              reject(new Error('User data not initialized in time'));
            }
          }, 100);
        });
      }
      await waitForUser();
      const ip = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip);
      const userVal: any = user.value;
      if (typeof message === 'object' && message !== null) {
        (message as Record<string, any>).level = 'warning';
        (message as Record<string, any>).ip = ip;
        (message as Record<string, any>).username = userVal?.username || userVal?.payload?.username;
        (message as Record<string, any>).userId = userVal?.uuid || userVal?.payload?.userId;
      } else {
        message = JSON.parse(message);
        (message as Record<string, any>).level = 'warning';
        (message as Record<string, any>).ip = ip;
        (message as Record<string, any>).username = userVal?.username || userVal?.payload?.username;
        (message as Record<string, any>).userId = userVal?.uuid || userVal?.payload?.userId;
      }
      message = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
      const msg = typeof message === 'object' ? JSON.stringify(message, null, 2) : message + '';
      sendMessage(msg);
    } catch (error) {
      console.error('Error in log.warning:', error);
      return;
    }
  },
    infoPublic: async (message: Record<string, any> | string) => {
    try {
      const ip = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip);
      if (typeof message === 'object' && message !== null) {
        (message as Record<string, any>).level = 'info';
        (message as Record<string, any>).ip = ip;
      } else {
        message = JSON.parse(message);
        (message as Record<string, any>).level = 'info';
        (message as Record<string, any>).ip = ip;
      }
      message = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
      const msg = typeof message === 'object' ? JSON.stringify(message, null, 2) : message + '';
      sendMessage(msg);
    } catch (error) {
      console.error('Error in log.info:', error);
      return;
    }
  },
}
