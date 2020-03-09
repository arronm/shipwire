const server = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(server)

describe('Product', () => {
  it('should be 1', () => {
    expect(1).toBe(1);
  });

  it('Gets the test endpoint', async (done) => {
    // Sends GET Request to /test endpoint
    const response = await request.get('/')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Api is up and running')
  
    done()
  })
});
