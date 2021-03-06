const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const expressWs = require('express-ws')(app);

const config = require('./config');
const users = require('./app/users');
const chat = require('./app/chat');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(config.db.url + '/' + config.db.name);

const db = mongoose.connection;

db.once('open', () => {
  console.log('Mongoose connected!');


  app.use('/chat', chat());
  app.use('/users', users());

const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });
});
