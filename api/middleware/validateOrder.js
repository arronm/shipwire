const log = require('../../utils/logger');
const db = require('../../data/models');

const ValidateOrder = async (req, res, next) => {
  try {
    const uniqueProducts = new Set();
    const lines = req.body.lines;
    for (let line of lines) {
      // check data type
      if (typeof(line.quantity) !== 'number') return res.status(422).json({
        status: 'error',
        error: 'InvalidType',
        message: `Expected type for (quantity) to be number, but received ${typeof(line.quantity)}`,
      })

      // check floats
      if (line.quantity % 1 !== 0) return res.status(422).json({
        status: 'error',
        error: 'InvalidType',
        message: `Expected type for (quantity) to be number, but received float.`,
      })

      // check line quantities
      if (line.quantity <= 0 || line.quantity > 5) return res.status(400).json({
        status: 'error',
        error: 'InvalidOrder',
        message: `Expected quantity between 1-5, received {${line.quantity}}`,
      });

      if (typeof(line.product) !== 'string') return res.status(422).json({
        status: 'error',
        error: 'InvalidType',
        message: `Expected type for (product) to be string, but received ${typeof(line.product)}.`,
      })

      // check product exists
      const product = await db('product').getBy({ name: line.product });
      if (!product.length > 0) return res.status(400).json({
        status: 'error',
        error: 'InvalidOrder',
        message: 'Product received does not exist.',
      });

      uniqueProducts.add(line.product);
    }

    // check each product only exists once
    if (lines.length !== uniqueProducts.size) return res.status(400).json({
      status: 'error',
      error: 'InvalidOrder',
      message: 'Received duplicate products in order.',
    });

    next();
  } catch (error) {
    const err = await log.err(error);
    res.status(500).json(err);
  }
};

module.exports = ValidateOrder;
