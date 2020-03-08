exports.seed = async (knex) => {
  await knex('order').insert([
    {
      stream_id: 1,
      header: '1',
    },
    {
      stream_id: 2,
      header: '2',
    },
    {
      stream_id: 3,
      header: '3',
    },
    {
      stream_id: 4,
      header: '4',
    },
    {
      stream_id: 5,
      header: '5',
    },
    {
      stream_id: 6,
      header: '6',
    },
  ]);
};
