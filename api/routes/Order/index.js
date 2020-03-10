const express = require('express');
const router = express.Router();

const dbModels = require('../../../data/models');

const models = {
  order: require('./order.model'),
  order_products: dbModels('order_products'),
  products: require('../Product/product.model'),
  job: dbModels('job'),
};

const validateOrder = require('../../middleware/validateOrder');
const log = require('../../../utils/logger');


const createOrder = require('../../../services/createOrder');
const createJob = require('../../../services/createJob');

/**
 * @api {post} /order/create Create an order
 * @apiName CreateOrder
 * @apiGroup Order
 *
 * @apiParam {integer} stream_id The id for the incoming stream.
 * @apiParam {string} header The order header provided by the stream.
 * @apiParam {object[]} lines Line items for the order.
 * @apiParam {string} lines.product Product name for this line item.
 * @apiParam {integer} lines.quantity Quantity to be submitted for this line item.
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
    // TODO: Order and job should be wrapped in a transaction
    const createdOrder = await createOrder(req.body, {
      order: models.order,
      product: models.products,
      line: models.order_products,
    });

    const createdJob = await createJob(createOrder, { job: models.job });

    return res.json({
      order: createdOrder,
      job: createdJob,
    });
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
