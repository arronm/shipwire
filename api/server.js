const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const logger = require('./middleware/logger');
const order = require('./routes/Order');
const db = require('../data/models')('product');
const prodDB = require('./routes/Product/product.model');
const jobDB = require('./job.model');

const middleware = [
  express.json(),
  cors(),
  helmet(),
  logger,
];

const server = express();
server.use(middleware);

// Product
  // Inventory
  // Restock
  // Add

// Order
  // Place
  // Info

// Stream
  // Add

// const rdb = require('../data/models');

// server.post('/order/place', async (req, res) => {
//   const orderDB = rdb('order');
//   const lineDB = rdb('order_products');


//   const { stream_id, header, lines } = req.body;

//   // add order
//   const order = await orderDB.add({
//     stream_id,
//     header,
//   });

//   const lineResults = []
//   const products = {};

//   // add lines
//   for (let line of lines) {
//     const product = await prodDB.getBy({ 'name': line.product });

//     // Keep product name for creating job
//     products[product[0].id] = line.product;

//     const lineResult = await lineDB.add({
//       order_id: order.id,
//       product_id: product[0].id,
//       quantity: line.quantity,
//       status: 'received',
//     });

//     lineResults.push(lineResult);
//   }

//   // add job
//   const job = await jobDB.add({
//     order_id: order.id,
//     header: order.header,
//     stream_id: order.stream_id,
//     lines: JSON.stringify(lineResults.map(({ id, product_id, quantity }) => ({
//       id,
//       product: products[product_id],
//       quantity,
//     }))),
//   });

//   return res.json({
//     order,
//     lineResults,
//     job
//   })
// });

// server.get('/add', async (req, res) => {
//   const data = await prodDB.add({
//     name: 'B',
//     inventory: 150,
//   });

//   return res.json({
//     message: 'Added',
//     data,
//   });
// });

// server.get('/inventory', async (req, res) => {
//   const data = await prodDB.get();
//   res.json({
//     data
//   })
// })

// const ValidateOrder = require('./middleware/ValidateOrder');

// server.post('/order/test', ValidateOrder, (req, res) => {
//   return res.json({
//     message: 'Ya ya, check the logs',
//     order: req.body,
//   });
// });

server.use('/api/order', order);
// server.use('/api/docs', express.static(__dirname + '/docs'));

server.get('/', (req, res) => {
  res.json({
    message: 'Api is up and running',
  });
});

module.exports = server;
