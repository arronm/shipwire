const express = require('express');

const router = express.Router();

const validateOrder = require('../../middleware/ValidateOrder');
const log = require('../../../utils/logger');

// Product
  // Inventory
  // Restock
  // Add

router.get('/', validateOrder, async (req, res) => {
  // api
});

module.exports = router;
