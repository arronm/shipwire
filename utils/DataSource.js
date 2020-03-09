// Must be capable of generating one or more streams of orders
const randRange = (min, max) => Math.floor((Math.random() * max) + min);

const numStreams = 6;
const products = [
  'A',
  'B',
  'C',
  'D',
  'E',
];

// Generate Order Data
const GenerateOrderData = () => {
  const stream = randRange(1, numStreams);
  const numProducts = randRange(1, products.length);

  const lines = []
  const lineProducts = [...products]; // make a copy of the products array

  for (let i = 1; i <= numProducts; i++) {
    lines.push({
      product: lineProducts.splice(randRange(1, lineProducts.length) - 1, 1)[0],
      quantity: randRange(1, 5),
    });
  };

  const order = {
    stream_id: stream,
    header: stream.toString(),
    lines,
  };

  console.log(order);
}

// Create Order

// Send Order

// Create Stream (spawn process)

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
    // TODO: set up axios to send orders through endpoint
    for (let i = 0; i <= 25; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // console.log(`Sending order #${i} from Stream ${this.id}`);
      console.log(this.generateOrderData());
    }
  }
}

// data source can create and spawn streams?
class DataSource {
  constructor(test) {
    this.test = test;
    this.streams = []
  }

  createStream(streamId) {
    // const streamId = randRange(1, numStreams);
    const stream = new Stream(streamId);
    this.streams.push(stream);
    stream.sendOrders();
  }

  createStreams() {
    // TODO: Spawn based on numStreams
    for (let i = 1; i < 3; i++) {
      this.createStream(i);
    }
  }
}

const data = new DataSource('abc');
data.createStreams();