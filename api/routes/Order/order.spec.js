const server = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(server)

let endpoint, body;

describe('/order', () => {
  describe('/create', () => {
    beforeAll(() => {
      endpoint = '/api/order/create';
      body = {
        stream_id: 1,
        header: '1',
        lines: [
          {
            product: 'A',
            quantity: 3,
          },
        ],
      };
    });

    it('validate quantity range', async (done) => {
      // test max quantity
      let quantity = 44;
      let response = await request.post(endpoint)
        .send({
          ...body,
          lines: [
            {
              product: 'A',
              quantity,
            },
          ],
        });

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        status: 'error',
        error: 'InvalidOrder',
        message: `Expected quantity between 1-5, received {${quantity}}`,
      });

      // test min quantity
      quantity = -13;
      response = await request.post(endpoint)
        .send({
          ...body,
          lines: [
            {
              product: 'A',
              quantity,
            },
          ],
        });

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        status: 'error',
        error: 'InvalidOrder',
        message: `Expected quantity between 1-5, received {${quantity}}`,
      });

      done();
    });

    it('validate data types', async (done) => {
      let quantity = 'a';
      let response = await request.post(endpoint)
        .send({
          ...body,
          lines: [
            {
              product: 'A',
              quantity,
            },
          ],
        });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        status: 'error',
        error: 'InvalidType',
        message: `Expected type for (quantity) to be number, but received ${typeof(quantity)}`,
      });

      quantity = 3.14;
      response = await request.post(endpoint)
        .send({
          ...body,
          lines: [
            {
              product: 'A',
              quantity,
            },
          ],
        });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        status: 'error',
        error: 'InvalidType',
        message: `Expected type for (quantity) to be number, but received float.`,
      });

      let product = 24;
      response = await request.post(endpoint)
        .send({
          ...body,
          lines: [
            {
              product,
              quantity: 3,
            },
          ],
        });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        status: 'error',
        error: 'InvalidType',
        message: `Expected type for (product) to be string, but received ${typeof(product)}.`,
      });

      done();
    });

    it('validate products', async (done) => {
      let response = await request.post(endpoint)
        .send({
          ...body,
          lines: [
            ...body.lines,
            {
              product: 'A',
              quantity: 5,
            },
          ],
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        error: 'InvalidOrder',
        message: 'Received duplicate products in order.',
      });

      response = await request.post(endpoint)
        .send({
          ...body,
          lines: [
            {
              product: 'XYZ',
              quantity: 3,
            },
          ],
        });

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        status: 'error',
        error: 'InvalidOrder',
        message: 'Product received does not exist.',
      })

      done()
    });
  });
});
