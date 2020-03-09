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

  it('validate quantity', async (done) => {
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

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      status: 'error',
      error: 'InvalidQuantity',
      message: `Quantity {${quantity}} received, expecting quantity between 1 and 5.`,
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

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      status: 'error',
      error: 'InvalidQuantity',
      message: `Quantity {${quantity}} received, expecting quantity between 1 and 5.`,
    });

    done();
  });
});
