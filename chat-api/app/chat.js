const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');

const clients = {};

const createRouter = () => {

  const router = express.Router();

  router.ws('/', (ws, req) => {
    const id = req.get('sec-websocket-key');
    clients[id] = ws;

    Message.find().then(messages => {
      ws.send(JSON.stringify({
          type: 'ALL_MESSAGES',
          messages: messages.slice(-30)
      }))
    });



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
          username = decodedMessage.username;
          break;
        case 'CREATE_MESSAGE':
          const token = req.query.token;

          User.findOne({token}).then(result => {
            const messageData = {
              text: decodedMessage.text,
              user: result.username
            };

            const message = new Message(messageData);

            message.save().then(message => {
              Object.values(clients).forEach(client => {
                client.send(JSON.stringify({
                  type: 'NEW_MESSAGE',
                  message: message
                }));
              });
            });
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