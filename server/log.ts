import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async () => {
  const server = createServer();

  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {

    ws.on('message', async (message) => {
      
    try {
      console.warn('Received message:', message.toString());
      
      const msg = JSON.parse(message.toString());
      console.log(message.toString());
      console.log(msg.username.toString(), msg.userId);
      
      const result = await prisma.log.create(
      {
        data: {
          title: msg.title,
          type: msg.type,
          level: msg.level,
          data: msg.data || null,
          ip: msg.ip? msg.ip : null,
          username: msg.username? msg.username : null,
          userId: msg.userId? msg.userId : null,
        }
      }
    )
    console.log(result);
    
    console.error('Log saved to database:', result);

    ws.send(JSON.stringify({ result: result }));

    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
      return;
    }



    });
  });

  server.listen(3001, () => {
    console.log('WebSocket server listening on ws://localhost:3001');
  });
};
