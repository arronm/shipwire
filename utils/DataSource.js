// Must be capable of generating one or more streams of orders
const axios = require('axios');

const randRange = (min, max) => Math.floor((Math.random() * max) + min);

const numStreams = 6;
const products = [
  'A',
  'B',
  'C',
  'D',
  'E',
];


class Stream {
  constructor(id) {
    this.id = id;
  }

  generateOrderData() {
    const numProducts = randRange(1, products.length);

    const lines = []
    const lineProducts = [...products];

    for (let i = 1; i <= numProducts; i++) {
      lines.push({
        product: lineProducts.splice(randRange(1, lineProducts.length) - 1, 1)[0],
        quantity: randRange(1, 5),
      });
    };

    const order = {
      stream_id: this.id,
      header: this.id.toString(),
      lines,
    };

    return order;
  }

  async createOrder() {
    // TODO: option to manually create orders in database (order, order_products, job)
  }

  async sendOrders() {
    // TODO: pass optional number of orders to generate to constructor
    const endpoint = 'http://localhost:4444/order/test';
    
    for (let i = 0; i <= 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await axios.post(endpoint, this.generateOrderData())
    }
  }
}


class DataSource {
  constructor(numStreams) {
    this.numStreams = numStreams;
    this.streams = [];
  }

  createStream(streamId) {
    const stream = new Stream(streamId);
    this.streams.push(stream);
    stream.sendOrders();
  }

  createStreams() {
    for (let i = 1; i <= numStreams; i++) {
      this.createStream(i);
    }
  }
}

const data = new DataSource(numStreams);
data.createStreams();