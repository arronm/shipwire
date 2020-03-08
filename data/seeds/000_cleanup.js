import cleaner from 'knex-cleaner';

exports.seed = knex => {
  return cleaner.clean(knex, {
    ignoreTables: ['knex_migrations', 'knex_migrations_lock']
  });
};
