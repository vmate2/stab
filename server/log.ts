import { WebSocketServer } from 'ws';
import { createServer } from 'http';

export default async () => {
  const server = createServer();

  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log('Received:', message.toString());
      ws.send(`Echo: ${message}`);
    });

    ws.send('Hello from server!');
  });

  server.listen(3001, () => {
    console.log('WebSocket server listening on ws://localhost:3001');
  });
};
