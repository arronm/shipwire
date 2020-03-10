const log = require('../../utils/logger');

const validateRequest = keys => async (req, res, next) => {
  let response = await new Promise((resolve) => {
    Object.keys(keys).forEach(async (key) => {
      if (keys[key].required && !req.body[key]) {
        return resolve({
          error: "MissingField",
          message: `Missing required field (${key})`,
        });
      }

      if (keys[key].type && req.body[key] && !(typeof req.body[key] === keys[key].type)) {
        return resolve({
          error: "InvalidType",
          message: `Expected type for (${key}) to be ${keys[key].type}, but instead saw ${typeof req.body[key]}`,
        });
      }

      if (keys[key].regex && keys[key].type === 'number') {
        const tempNumber = Number.isInteger(req.body[key]) ? req.body[key] + ".0" : req.body[key].toString();
        if (!tempNumber.match(keys[key].regex)) return resolve({
          error: 'BadValue',
          message: `Value for \`${key}\` did not match the expected requirements, please reference the documentation.`,
        });
      } else if (keys[key].regex && !(req.body[key].match(keys[key].regex))) return resolve({
        error: 'BadValue',
        message: `Value for \`${key}\` did not match the expected requirements, please reference the documentation.`,
      });

      if (keys[key].exists) {
        const { database: db, table, column } = keys[key].exists;
        const resource = await db(table).cb(db => {
          return db(table)
          .where(column, req.body[key])
        });

        if (!resource.length) {
          return resolve({
            message: `Provided ${key} does not exist, please provide a valid ${key}`,
          });
        }
      }
    });
    return resolve(null);
  });

  if (response) return res.status(422).json({
    status: 'error',
    ...response,
  });
  next();
}

module.exports = validateRequest;