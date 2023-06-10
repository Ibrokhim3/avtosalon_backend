const jwt = require("jsonwebtoken");

module.exports.verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.token) {
      return res.status(400).json("You have to log in to the system!");
    }

    const userData = jwt.verify(req.headers.token, process.env.SECRET_KEY);

    if (userData) {
      return next();
    }
    return res
      .status(404)
      .json("Token doesn't exist or you are not authorized!");
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error - token" });
  }
};
