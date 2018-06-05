const express = require('express');


const clients = {};

const createRouter = () => {

  const router = express.Router();

  router.ws('/', (ws, req) => {
    const id = req.get('sec-websocket-key');
    clients[id] = ws;

    console.log('client connected');
    console.log('Number of active connections', Object.values(clients).length);

    let username;

    ws.on('message', (msg) => {
      console.log('Clients sent message: ', msg);
      let decodedMessage;

      try {
        decodedMessage = JSON.parse(msg);
      } catch (e) {
        return ws.send(JSON.stringify({
          type: 'ERROR',
          message: 'Message is not JSON'
        }));
      }

      switch (decodedMessage.type) {
        case 'SET_USERNAME':
          username = req.query.token;
          break;
        case 'CREATE_MESSAGE':
          Object.values(clients).forEach(client => {
            client.send(JSON.stringify({
              type: 'NEW_MESSAGE',
              text: decodedMessage.text,
              username: username
            }));
          });
          break;
        default:
          return ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Unknown message type'
          }));
      }
    });

    ws.on('close', () => {
      delete clients[id];
      console.log('Client disconnected');
      console.log('Number of active connections', Object.values(clients).length);
    });
  });
  return router;
};

module.exports = createRouter;