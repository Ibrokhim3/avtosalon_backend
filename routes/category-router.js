const { Router } = require("express");
const categoryCtr = require("../controllers/category-controller");
const {
  userValidate,
  modelValidate,
  categoryValidate,
} = require("../middlewares/validation-middleware");
const { verifyToken } = require("../middlewares/auth-middleware");

const router = Router();

//categories

router.get("/get-categories/:id", categoryCtr.GET_ONE_CATEGORY);

router.get("/get-categories", categoryCtr.GET_CATEGORIES);

router.post("/add-category", categoryValidate, categoryCtr.ADD_CATEGORY);
router.put("/update-category", categoryCtr.UPDATE_CATEGORY);

router.delete("/delete-category", categoryCtr.DELETE_CATEGORY);

module.exports = router;
