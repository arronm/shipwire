exports.seed = async (knex) => {
  await knex('product').insert([
    {
      order_id: 1,
      task: JSON.stringify({
        header: 1,
        lines: [
          {
            product: 'A',
            quantity: 1,
          },
          {
            product: 'C',
            quantity: 1,
          },
        ],
      }),
    },
    {
      order_id: 2,
      task: JSON.stringify({
        header: 1,
        lines: [
          {
            product: 'E',
            quantity: 5,
          },
        ],
      }),
    },
    {
      order_id: 3,
      task: JSON.stringify({
        header: 1,
        lines: [
          {
            product: 'D',
            quantity: 4,
          },
        ],
      }),
    },
    {
      order_id: 4,
      task: JSON.stringify({
        header: 1,
        lines: [
          {
            product: 'A',
            quantity: 1,
          },
          {
            product: 'C',
            quantity: 1,
          },
        ],
      }),
    },
    {
      order_id: 5,
      task: JSON.stringify({
        header: 1,
        lines: [
          {
            product: 'B',
            quantity: 3,
          },
        ],
      }),
    },
    {
      order_id: 6,
      task: JSON.stringify({
        header: 1,
        lines: [
          {
            product: 'D',
            quantity: 4,
          },
        ],
      }),
    },
  ]);
};
