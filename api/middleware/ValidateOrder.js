const log = require('../../utils/logger');
const db = require('../../data/models');

const ValidateOrder = async (req, res, next) => {
  try {
    // has header
    if (!req.body.header) return res.status(500).json({
      message: 'Missing header',
    });
    
    const uniqueProducts = new Set();
    const lines = req.body.lines;
    for (let line of lines) {
      // check line quantities
      if (line.quantity <= 0 || line.quantity > 5) return res.status(500).json({
        status: 'error',
        error: 'InvalidQuantity',
        message: `Quantity {${line.quantity}} received, expecting quantity between 1 and 5.`,
      });

      // check product exists
      const product = await db('product').getBy({ name: line.product });
      if (!product.length > 0) return res.status(500).json({
        message: 'Invalid product',
      });

      uniqueProducts.add(line.product);
    }

    // check each product only exists once
    if (lines.length !== uniqueProducts.length) return res.status(500).json({
      message: 'Invalid Order, duplicate products',
    });

    next();
  } catch (error) {
    const err = await log.err(error);
    res.status(500).json(err);
  }
};

module.exports = ValidateOrder;
