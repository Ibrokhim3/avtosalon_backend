const { modelValidation } = require("../validation/model-validation");
const { signupValidation } = require("../validation/user-validation");

const { categoryValidation } = require("../validation/category-validation");

exports.userValidate = function (req, res, next) {
  try {
    const { error } = signupValidation(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ msg: error.details[0].message });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

exports.categoryValidate = function (req, res, next) {
  try {
    const { error } = categoryValidation(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ msg: error.details[0].message });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

exports.modelValidate = function (req, res, next) {
  try {
    const { error } = modelValidation(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ msg: error.details[0].message });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
