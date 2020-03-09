exports.seed = async (knex) => {
  await knex('product').insert([
    {
      name: 'A',
      inventory: 200,
    },
    {
      name: 'B',
      inventory: 300,
    },
    {
      name: 'C',
      inventory: 1,
    },
    {
      name: 'D',
      inventory: 0,
    },
    {
      name: 'E',
      inventory: 0,
    },
  ]);
};
