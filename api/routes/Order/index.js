const express = require('express');
const router = express.Router();

const db = require('../../../data/models');

const tables = {
  order: require('./order.model'),
  order_products: db('order_products'),
  products: require('../Product/product.model'),
  job: db('job'),
};

const validateOrder = require('../../middleware/ValidateOrder');
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
 * @apiError InvalidQuantity Quantity critera for this request was not met
 * @apiErrorExample InvalidQuantity-Response
 *  HTTP/1.1 422 Unprocessable Entity
 *    {
 *      "status": "error",
 *      "error": "InvalidQuantity",
 *      "message": "Quantity {12} received, expecting integer between 1 and 5.",
 *    }
 * 
 * @apiError NotFound Requested resource was not found.
 * @apiErrorExample NotFound-Response
 *  HTTP/1.1 404 Not Found
 *    {
 *      "status": "error",
 *      "error": "NotFound",
 *      "message": "No resource was found with the requested id (4)",
 *    }
 * 
 */
router.post('/create', validateOrder, async (req, res) => {
  const orderDB = tables.order;
  const lineDB = tables.order_products;
  const prodDB = tables.products;
  const jobDB = tables.job;

  const { stream_id, header, lines } = req.body;

  // add order
  const order = await orderDB.add({
    stream_id,
    header,
  });

  const lineResults = []
  const products = {};

  // add lines
  for (let line of lines) {
    const product = await prodDB.getBy({ 'name': line.product });

    // Keep product name for creating job
    products[product[0].id] = line.product;

    const lineResult = await lineDB.add({
      order_id: order.id,
      product_id: product[0].id,
      quantity: line.quantity,
      status: 'received',
    });

    lineResults.push(lineResult);
  }

  // add job
  const job = await jobDB.add({
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
});

module.exports = router;
