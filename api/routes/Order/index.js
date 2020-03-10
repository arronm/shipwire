const express = require('express');
const router = express.Router();

const db = require('../../../data/models');

const tables = {
  order: require('./order.model'),
  order_products: db('order_products'),
  products: require('../Product/product.model'),
  job: db('job'),
};

const validateOrder = require('../../middleware/validateOrder');
const log = require('../../../utils/logger');

/**
 * @api {post} /order/create Create an order
 * @apiName CreateOrder
 * @apiGroup Order
 *
 * @apiParam {integer} stream_id The id for the incoming stream.
 * @apiParam {string} header The order header provided by the stream.
 * @apiParam {{ product: string, quantity: integer }[]} lines Line items for the order.
 *
 * @apiSuccess {string} status Status of the request.
 * @apiSuccess {string} message Informative message indicating action(s) taken.
 * @apiSuccess {object} order Order information.
 * @apiSuccess {id} order.id Order id as added in the system.
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *    {
 *       "status": "success",
 *       "message": "Successfully created an order.",
 *       "order": {
 *         "id": 4,
 *       }
 *     }
 *
 * @apiError InvalidOrder Order did not match expected requirements.
 * @apiErrorExample InvalidOrder-Response
 *  HTTP/1.1 400 BadRequest
 *    {
 *      "status": "error",
 *      "error": "InvalidOrder",
 *      "message": "Expected quantity between 1-5, received {44}",
 *    }
 * 
 */
router.post('/create', validateOrder, async (req, res) => {
  try {
    const orderTable = tables.order;
    const lineTable = tables.order_products;
    const productTable = tables.products;
    const jobTable = tables.job;

    const { stream_id, header, lines } = req.body;

    // add order
    const order = await orderTable.add({
      stream_id,
      header,
    });

    const lineResults = []
    const products = {};

    // add lines
    for (let line of lines) {
      const product = await productTable.getBy({ 'name': line.product });

      // Keep product name for creating job
      products[product[0].id] = line.product;

      const lineResult = await lineTable.add({
        order_id: order.id,
        product_id: product[0].id,
        quantity: line.quantity,
        status: 'received',
      });

      lineResults.push(lineResult);
    }

    // add job
    const job = await jobTable.add({
      order_id: order.id,
      header: order.header,
      stream_id: order.stream_id,
      lines: JSON.stringify(lineResults.map(({ id, product_id, quantity }) => ({
        id,
        product: products[product_id],
        quantity,
      }))),
    });

    return res.json({
      order,
      lineResults,
      job
    })
  } catch (error) {
    const err = await log.err(error);
    res.status(500).json(err);
  }
});

router.get('/status/:id', async (req, res) => {
  try {
    // api
    res.json({
      message: 'Not Yet Implemented.',
    });
  } catch (error) {
    const err = await log.err(error);
    res.status(500).json(err);
  }
})

module.exports = router;
