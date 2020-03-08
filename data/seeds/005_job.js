exports.seed = async (knex) => {
  await knex('job').insert([
    {
      order_id: 1,
      header: 1,
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
      header: 1,
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
      header: 1,
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
      header: 1,
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
      header: 1,
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
      header: 1,
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
