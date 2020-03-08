const db = require('../data/models')('product');

// TODO: Depreciate this function
const getTotalInventory = async () => {
  return db.cb(async (db) => {
    const { total } = await db('product')
      .sum('inventory as total')
      .first()
    return total;
  });
};

const getInventory  = async () => {
  return db.cb(async (db) => {
    const inv = await db('product')
      .select('name')
      .select('inventory');

    // reduce our inventory into a key,value object with track of total
    return inv.reduce((previous, current) => {
      previous.__total += current.inventory;
      previous[current.name] = current.inventory;
      return previous;
    }, { '__total': 0 });
  });
}

module.exports = {
  ...db,
  getTotalInventory,
  getInventory,
};
