const mongoose = require('mongoose');
const config = require('config');

const User = require('./models/User');

mongoose.connect(config.db.url + '/' + config.db.name);

const db = mongoose.connection;
const collections = ['users', 'messages'];

db.once('open', async () => {
  collections.forEach(async collectionName => {
    try {
      await db.dropCollection(collectionName);
    } catch (e) {
      console.log(`Collection ${collectionName} did not exist in DB`);
    }
  });

  await User.create({
    username: 'user',
    password: '123',
    role: 'user'
  }, {
    username: 'admin',
    password: '123',
    role: 'admin'
  });

db.close();
});