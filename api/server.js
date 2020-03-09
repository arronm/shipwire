const express = require('express');

const logger = require('./middleware/logger');
const db = require('../data/models')('product');
const prodDB = require('./routes/Product/product.model');
const jobDB = require('./job.model');

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

const rdb = require('../data/models');

server.post('/order/place', async (req, res) => {

  /*
    order
  */

  const orderDB = rdb('order');
  const lineDB = rdb('order_products');


  const { stream_id, header, lines } = req.body;

  // add order
  const order = await orderDB.add({
    stream_id,
    header,
  });

  const lineResults = []
  const products = {};

  // add lines
  for (let line of lines) {
    const product = await prodDB.getBy({ 'name': line.product });

    // Keep product name for creating job
    products[product[0].id] = line.product;

    const lineResult = await lineDB.add({
      order_id: order.id,
      product_id: product[0].id,
      quantity: line.quantity,
      status: 'received',
    });

    lineResults.push(lineResult);
  }

  // add job
  const job = await jobDB.add({
    order_id: order.id,
    header: order.header,
    stream: order.stream_id,
    lines: JSON.stringify(lineResults.map(({ id, product_id, quantity }) => ({
      id,
      product: products[product_id],
      quantity,
    }))),
  });

  return res.json({
    order,
    lineResults,
    job
  })
});

server.get('/logs', async (req, res) => {
  const data = await jobDB.add({
    header: 2,
    task: 'Three',
    priority: 4,
  });

  return res.json({
    message: 'Success',
    data,
  })
})

server.get('/add', async (req, res) => {
  const data = await prodDB.add({
    name: 'B',
    inventory: 150,
  });

  return res.json({
    message: 'Added',
    data,
  });
});

server.get('/inventory', async (req, res) => {
  const data = await prodDB.get();
  res.json({
    data
  })
})

const ValidateOrder = require('./middleware/ValidateOrder');

server.post('/order/test', ValidateOrder, (req, res) => {
  return res.json({
    message: 'Ya ya, check the logs',
    order: req.body,
  });
});

server.get('/', (req, res) => {
  res.json({
    message: 'Api is up and running',
  });
});

module.exports = server;
