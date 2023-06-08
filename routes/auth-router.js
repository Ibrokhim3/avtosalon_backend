const { Router } = require("express");
const userCtr = require("../controllers/auth-controller");
const { userValidate } = require("../middlewares/validation-middleware");

const { verifyToken } = require("../middlewares/auth-middleware");

const router = Router();

router.post("/signup", userValidate, userCtr.SIGNUP);
router.post("/login", userCtr.LOGIN);
router.post("/buy-car", userCtr.BUY);
router.post("/like-car", userCtr.LIKE);
router.get("/get-users", verifyToken, userCtr.GET_USERS);
router.delete(
  "/delete-user-by-admin",
  verifyToken,
  userCtr.DELETE_USER_BY_ADMIN
);
router.put("/update-user-by-admin", verifyToken, userCtr.UPDATE_USER_BY_ADMIN);
router.get("/get-one-user", userCtr.GET_ONE_USER);

module.exports = router;
