const {HttpError} = require('../helpers');

const validateBody = (schema, message) => {
  const func = async (req, res, next) => {
    const {error} = schema.validate(req.body);

    if (error) {
      throw HttpError(400, message ?? error.message);
    }

    next();
  };

  return func;
};

module.exports = validateBody;
