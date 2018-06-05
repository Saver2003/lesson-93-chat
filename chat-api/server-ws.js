const express = require('express');
const cors = require('cors');
const app = express();
const expressWs = require('express-ws')(app);
const chat = require('./app/chat');
const users = require('/app/users');

const port = 8000;

app.use(cors());

app.use('/chat', chat());
app.use('/users', users());




app.ws('/user');


app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});
