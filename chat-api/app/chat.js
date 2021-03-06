const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');

const clients = {};

const createRouter = () => {

  let user;

  const router = express.Router();

  router.ws('/', async (ws, req) => {

    const token = req.query.token;

    user = await User.findOne({token});

    console.log(user)

    const id = req.get('sec-websocket-key');
    clients[id] = ws;

    clients[id].connectedUser = user;

    const currentUser = clients[id].connectedUser;

    let connectedUsers = Object.keys(clients).map(key => {
      return clients[key].connectedUser;
    });

    Object.values(clients).forEach(client => {
      client.send(JSON.stringify({
        type: 'UPDATE_USERS',
        users: connectedUsers,
        user: clients[id].connectedUser
      }));
    });

    Message.find().then(messages => {
      ws.send(JSON.stringify({
        type: 'ALL_MESSAGES',
        messages: messages.slice(-30)
      }))
    });

    console.log('client connected');
    console.log('Number of active connections', Object.values(clients).length);

    let username;

    ws.on('message', async (msg) => {
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
        case 'CLOSE_CONNECTION':
          ws.close();
          break;
        case 'SET_USERNAME':
          username = decodedMessage.username;
          break;
        case 'CREATE_MESSAGE':
          console.log('new message');

          const messageData = {
            text: decodedMessage.text,
            user: currentUser.username
          };

          const message = new Message(messageData);

          await message.save();

          Object.values(clients).forEach(client => {
            client.send(JSON.stringify({
              type: 'NEW_MESSAGE',
              message: message
            }));
          });
          break;
        case 'DELETE_MESSAGE':
          if (currentUser.role !== 'admin') {
            return ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Unauthorized',
            }))
          } else {
            const delMessage = await Message.findByIdAndDelete(decodedMessage.id);
            Object.values(clients).forEach(client => {
              client.send(JSON.stringify({
                type: 'DELETE_SUCCESS',
                message: delMessage._id
              }));
            });
          }
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

      connectedUsers = Object.keys(clients).map(key => {
        return clients[key].connectedUser;
      });

      Object.values(clients).forEach(client => {
        client.send(JSON.stringify({
          type: 'UPDATE_USERS',
          users: connectedUsers
        }));
      });

      console.log('Client disconnected');
      console.log('Number of active connections', Object.values(clients).length);
    });
  });
  return router;
};

module.exports = createRouter;