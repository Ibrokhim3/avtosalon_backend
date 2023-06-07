const { Router } = require("express");
const userCtr = require("../controllers/auth-controller");
const { userValidate } = require("../middlewares/validation-middleware");

const router = Router();

router.post("/signup", userValidate, userCtr.SIGNUP);
router.post("/login", userCtr.LOGIN);
router.post("/buy-car", userCtr.BUY);
router.post("/like-car", userCtr.LIKE);
router.get("/get-users", userCtr.GET_USERS);

module.exports = router;
