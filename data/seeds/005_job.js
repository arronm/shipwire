exports.seed = async (knex) => {
  await knex('job').insert([
    {
      order_id: 1,
      header: '1',
      stream: 1,
      lines: JSON.stringify([
          {
            id: 1,
            product: 'A',
            quantity: 1,
          },
          {
            id: 2,
            product: 'C',
            quantity: 1,
          },
      ]),
    },
    {
      order_id: 2,
      header: '2',
      stream: 2,
      lines: JSON.stringify([
          {
            id: 3,
            product: 'E',
            quantity: 5,
          },
      ]),
    },
    {
      order_id: 3,
      header: '3',
      stream: 3,
      lines: JSON.stringify([
          {
            id: 4,
            product: 'D',
            quantity: 4,
          },
      ]),
    },
    {
      order_id: 4,
      header: '4',
      stream: 4,
      lines: JSON.stringify([
          {
            id: 5,
            product: 'A',
            quantity: 1,
          },
          {
            id: 6,
            product: 'C',
            quantity: 1,
          },
      ]),
    },
    {
      order_id: 5,
      header: '5',
      stream: 5,
      lines: JSON.stringify([
          {
            id: 7,
            product: 'B',
            quantity: 3,
          },
      ]),
    },
    {
      order_id: 6,
      header: '6',
      stream: 6,
      lines: JSON.stringify([
          {
            id: 8,
            product: 'D',
            quantity: 4,
          },
      ]),
    },
  ]);
};
