exports.seed = async (knex) => {
  await knex('stream').insert([
    { name: '1' },
    { name: '2' },
    { name: '3' },
    { name: '4' },
    { name: '5' },
    { name: '6' },
  ]);
};
