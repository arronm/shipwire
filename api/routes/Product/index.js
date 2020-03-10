const express = require('express');

const router = express.Router();

const validateOrder = require('../../middleware/ValidateOrder');
const log = require('../../../utils/logger');

// Product
  // Inventory
  // Restock
  // Add

router.get('/', validateOrder, async (req, res) => {
  try {
    // api
    res.json({
      message: 'Not Yet Implemented.',
    });
  } catch (error) {
    const err = await log.err(error);
    res.status(500).json(err);
  }
});

module.exports = router;
