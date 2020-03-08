exports.up = function(knex, Promise) {
  return knex.schema
    // Stream
    .createTable('stream', table => {
      table.increments();
      table.string('name', 32)
        .notNullable();
    })

    // Order
    .createTable('order', table => {
      table.increments();
      table.int('stream_id')
        .references('stream.id');
      table.timestamp('created_at')
        .defaultsTo(knex.fn.now());
    })

    // Product
    .createTable('product', table => {
      table.increments();
      table.string('name', 64)
        .notNullable();
      table.integer('inventory')
        .defaultsTo(0);
    })

    // Order Products
    .createTable('order_products', table => {
      table.increments();
      table.integer('order_id')
        .references('order.id');
      table.integer('product_id')
        .references('product.id');
      table.integer('quantity', 1)
        .notNullable();
      table.string('status', 32)
        .defaultsTo('received');

      // each order should only have each product once
      table.unique(['order_id', 'product_id']);
    })

  // Transaction
    .createTable('transaction', table => {
      table.increments();
      table.int('order_products_id')
        .references('order_products.id');
      table.string('type', 32)
        .notNullable();
      table.timestamp('created_at')
        .defaultsTo(knex.fn.now());
    })

  // Job
    .createTable('job', table => {
      table.increments();
      table.int('order_id')
        .references('order.id');
      table.timestamp('created_at')
        .defaultTo(knex.fn.now());
      table.string('task', 128)
        .notNullable();
      table.integer('priority', 1)
        .defaultTo(0);
      table.string('header', 32)
        .notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('user');
};
