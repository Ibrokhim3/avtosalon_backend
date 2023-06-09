const { Router } = require("express");
const userCtr = require("../controllers/auth-controller");
const { userValidate } = require("../middlewares/validation-middleware");

const { verifyToken } = require("../middlewares/auth-middleware");

const router = Router();

router.get("/get-users", verifyToken, userCtr.GET_USERS);

router.get("/get-one-user", userCtr.GET_ONE_USER);

router.post("/signup", userValidate, userCtr.SIGNUP);

router.post("/login", userCtr.LOGIN);

router.post("/buy-car", verifyToken, userCtr.BUY);

router.post("/like-car", verifyToken, userCtr.LIKE);

router.delete(
  "/delete-user-by-admin",
  verifyToken,
  userCtr.DELETE_USER_BY_ADMIN
);
router.put("/update-user-by-admin", verifyToken, userCtr.UPDATE_USER_BY_ADMIN);

module.exports = router;
