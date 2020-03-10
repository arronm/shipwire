// requires models: order, product, line (order_products)
const createOrder = async ({ stream_id, header, lines }, models) => {
  try {
    const order = await models.order.add({
      stream_id,
      header,
    });

    const linesData = [];

    for (let line of lines) {
      const product = await models.product.getBy({ 'name': line.product }).first();

      const lineData = await models.line.add({
        order_id: order.id,
        product_id: product.id,
        quantity: line.quantity,
      });

      linesData.push({
        ...lineData,
        product_name: line.product,
      });
    }

    return {
      ...order,
      lines: linesData,
    };
  } catch (error) {
    throw new Error(error); // pass-through
  }
}

module.exports = createOrder;
