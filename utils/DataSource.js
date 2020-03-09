// Must be capable of generating one or more streams of orders
const faker = require('faker');

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
  // console.log('lineProducts', lineProducts)

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


GenerateOrderData();
