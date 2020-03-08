exports.seed = async (knex) => {
  await knex('order_products').insert([
    {
      order_id: 1,
      product_id: 1,
      quantity: 1,
    },
    {
      order_id: 1,
      product_id: 3,
      quantity: 1,
    },
    {
      order_id: 2,
      product_id: 5,
      quantity: 5,
    },
    {
      order_id: 3,
      product_id: 4,
      quantity: 4,
    },
    {
      order_id: 4,
      product_id: 1,
      quantity: 1,
    },
    {
      order_id: 4,
      product_id: 3,
      quantity: 1,
    },
    {
      order_id: 5,
      product_id: 2,
      quantity: 3,
    },
    {
      order_id: 6,
      product_id: 4,
      quantity: 4,
    },
  ]);
};
