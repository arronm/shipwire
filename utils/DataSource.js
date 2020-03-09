// Must be capable of generating one or more streams of orders
const axios = require('axios');

const randRange = (min, max) => Math.round((Math.random() * (max - min)) + min);

const orderEndpoint = 'http://localhost:4444/order/place';
const numStreams = 6;
const products = [
  'A',
  'B',
  'C',
  'D',
  'E',
];


class Stream {
  constructor(id, numberOfOrders) {
    this.id = id;
    this.numberOfOrders = numberOfOrders;
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
    for (let i = 1; i <= this.numberOfOrders; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await axios.post(orderEndpoint, this.generateOrderData())
    }
  }
}


class DataSource {
  constructor(numStreams) {
    this.numStreams = numStreams;
    this.streams = [];
  }

  createStream(streamId, numberOfOrders) {
    const stream = new Stream(streamId, numberOfOrders);
    this.streams.push(stream);
    stream.sendOrders();
  }

  createStreams() {
    for (let i = 1; i <= numStreams; i++) {
      const numberOfOrders = randRange(10, 30);
      this.createStream(i, numberOfOrders);
    }
  }
}

const data = new DataSource(numStreams);
data.createStreams();
