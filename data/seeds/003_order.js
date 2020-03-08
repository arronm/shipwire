exports.seed = async (knex) => {
  await knex('order').insert([
    {
      stream_id: 1
    },
    {
      stream_id: 2
    },
    {
      stream_id: 3
    },
    {
      stream_id: 4
    },
    {
      stream_id: 5
    },
    {
      stream_id: 6
    },
  ]);
};
