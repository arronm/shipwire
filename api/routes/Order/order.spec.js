const server = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(server)

describe('Order Endpoints', () => {
  it('Gets the test endpoint', async (done) => {
    // Sends GET Request to /test endpoint
    const response = await request.get('/')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Api is up and running')
  
    done()
  })

  it('validate quantity range', async (done) => {
    // test max quantity
    let quantity = 44;
    let response = await request.post('/order/test')
      .send({
        stream_id: 1,
        header: '1',
        lines: [
          {
            product: 'A',
            quantity: quantity,
          },
        ],
    });

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      status: 'error',
      error: 'InvalidQuantity',
      message: `Expected quantity between 1-5, received {${quantity}}`,
    });

    // test min quantity
    quantity = -13;
    response = await request.post('/order/test')
      .send({
        stream_id: 1,
        header: '1',
        lines: [
          {
            product: 'A',
            quantity: quantity,
          },
        ],
      });

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      status: 'error',
      error: 'InvalidQuantity',
      message: `Expected quantity between 1-5, received {${quantity}}`,
    });

    done();
  });

  it('validate data types', async (done) => {
    let quantity = 'a';
    let response = await request.post('/order/test')
      .send({
        stream_id: 1,
        header: '1',
        lines: [
          {
            product: 'A',
            quantity: quantity,
          },
        ],
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      status: 'error',
      error: 'InvalidType',
      message: `Expected type for (quantity) to be number, but received ${typeof(quantity)}`,
    });

    done();
  });

  it('validate products', async (done) => {
    let response = await request.post('/order/test')
      .send({
        stream_id: 1,
        header: '1',
        lines: [
          {
            product: 'A',
            quantity: 5,
          },
          {
            product: 'A',
            quantity: 5,
          },
        ]
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      error: 'InvalidLineItems',
      message: 'Order should not contain duplicate products on separate lines.',
    });

    done()
  })
});
