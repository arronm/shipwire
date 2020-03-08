const express = require('express');

const logger = require('./middleware/logger');
const db = require('../data/models')('product');
const prodDB = require('./product.model');

const middleware = [
  express.json(),
  logger,
];

const server = express();
server.use(middleware);

// Inventory
// Order
  // Place
  // Info

server.get('/total', async (req, res) => {

  const total = await prodDB.getTotalInventory();

  return res.json({
    message: "Success",
    total,
  });
})

server.get('/add', async (req, res) => {
  const data = await db.add({
    name: 'B',
    inventory: 150,
  });

  return res.json({
    message: 'Added',
    data,
  });
})

server.get('/', (req, res) => {
  res.json({
    message: 'Api is up and running',
  });
});

module.exports = server;
