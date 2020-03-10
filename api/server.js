const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const logger = require('./middleware/logger');
const order = require('./routes/Order');
// const product = require('./routes/Product');
// const stream = require('./routes/Stream');

const middleware = [
  express.json(),
  cors(),
  helmet(),
  logger,
];

const server = express();
server.use(middleware);

server.use('/api/order', order);
// server.use('/api/product', product);
// server.use('/api/stream', stream);
// server.use('/api/docs', express.static(__dirname + '/docs'));

server.get('/', (req, res) => {
  res.json({
    message: 'Api is up and running',
  });
});

module.exports = server;
