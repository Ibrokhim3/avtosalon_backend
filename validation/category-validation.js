const Joi = require("joi");

exports.categoryValidation = (data) => {
  const schema = Joi.object({
    categoryName: Joi.string().min(2).max(20).required(),
  });

  return schema.validate(data);
};
