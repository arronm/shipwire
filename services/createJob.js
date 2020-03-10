// requires model: job
const createJob = async ({ id, header, stream_id, lines}, models) => {
  try {
    const job = await models.job.add({
      order_id: id,
      header,
      stream_id,
      lines: JSON.stringify(lines.map( ({ id, product_name: product, quantity }) => ({
        id,
        product,
        quantity,
      })))
    });

    return job;
  } catch (error) {
    throw new Error(error); // pass-through
  }
};

module.exports = createJob;
