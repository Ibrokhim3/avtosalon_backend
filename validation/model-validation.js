const Joi = require("joi");

exports.modelValidation = (data) => {
  const schema = Joi.object({
    carName: Joi.string().min(2).max(50).required(),
    carPrice: Joi.number().required(),
    tonirovka: Joi.string().min(2).max(50).required(),
    motor: Joi.string().min(2).max(50).required(),
    year: Joi.string().min(2).max(50).required(),
    color: Joi.string().min(2).max(50).required(),
    distance: Joi.number().required(),
    gearbox: Joi.string().min(2).max(50).required(),
    desc: Joi.string().min(2).max(300).required(),
    allExp: Joi.number().required(),
    categoryId: Joi.string().required(),
  });

  return schema.validate(data);
};
