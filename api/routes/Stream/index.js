const express = require('express');

const router = express.Router();

const validateOrder = require('../../middleware/ValidateOrder');
const log = require('../../../utils/logger');

// Stream
  // Add

router.get('/', validateOrder, async (req, res) => {
  try {
    // api
  } catch (error) {
    const err = await log.err(error);
    res.status(500).json(err);
  }
});

module.exports = router;
