const Joi = require("joi");

exports.signupValidation = (data) => {
  const schema = Joi.object({
    userEmail: Joi.string().email().min(5).max(50).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    password2: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    userRole: Joi.string(),
  });

  return schema.validate(data);
};
