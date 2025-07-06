// composables/useWebSocket.ts
import { onBeforeUnmount, getCurrentInstance } from 'vue'

export function useWebSocket(url?: string) {
  // Determine the WebSocket URL dynamically
  let wsUrl = url;
  if (!wsUrl) {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.host.replace(/(:\d+)?$/, ':3001')}`;
    } else {
      wsUrl = 'ws://localhost:3001';
    }
  }
  const socket = new WebSocket(wsUrl)

  const sendMessage = (message: any) => {
    try {
      const strMessage = typeof message === 'string' ? message : JSON.stringify(message)

      console.warn(typeof strMessage, strMessage);
      const msg = JSON.parse(strMessage);
      if (!msg.title || !msg.type || !msg.level) {
        console.error('Invalid log format:', msg);
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request: Missing required fields in log message',
        })
        
      }

      if (socket.readyState === WebSocket.OPEN) {
        const reply = socket.send(strMessage)
        console.warn('WebSocket message sent:', reply);
        
      } else {
        console.warn('WebSocket not open:', socket.readyState)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const onMessage = (handler: (event: MessageEvent) => void) => {
    socket.addEventListener('message', handler)
  }

  // Only register onBeforeUnmount if inside a component instance
  if (getCurrentInstance()) {
    onBeforeUnmount(() => {
      socket.close()
    })
  }

  return {
    sendMessage,
    onMessage,
    socket,
  }
}
