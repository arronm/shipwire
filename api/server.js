const express = require('express');

const logger = require('./middleware/logger');
const db = require('../data/models.js')('user');

const middleware = [
  express.json(),
  logger,
];

const server = express();
server.use(middleware);

server.get('/user/:name', async (req, res) => {
  const message = await db.add({
    user: req.params.name,
  });
  return res.json({
    message,
  });
});

server.get('/get', async (req, res) => {
  const message = await db.get();
  return res.json({
    message,
  });
});

server.get('/', (req, res) => {
  res.json({
    message: 'Api is up and running',
  });
});

module.exports = server;
