exports.seed = async (knex) => {
  await knex('product').insert([
    {
      name: 'A',
      inventory: 150,
    },
    {
      name: 'B',
      inventory: 100,
    },
    {
      name: 'C',
      inventory: 100,
    },
    {
      name: 'D',
      inventory: 100,
    },
    {
      name: 'E',
      inventory: 200,
    },
  ]);
};
