const express = require('express');

const router = express.Router();

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
 * @apiError NonUnique Unique constraint for this request was not met
 * @apiErrorExample NonUnique-Response
 *  HTTP/1.1 400 Bad Request
 *    {
 *      "status": "error",
 *      "error": "NonUnique",
 *      "message": "Provided `user_id` and `book_id` must be unique: [user.id(1), book.id(2)] already exists in the database.",
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
  // api
});

module.exports = router;
