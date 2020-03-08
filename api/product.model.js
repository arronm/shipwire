const db = require('../data/models')('product');

const getTotalInventory = async () => {
  console.log('getting inventory');
  return db.cb(async (db) => {
    const { total } = await db('product')
      .sum('inventory as total')
      .first()
    return total;
  });
};

module.exports = {
  ...db,
  getTotalInventory,
};
