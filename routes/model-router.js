const { Router } = require("express");
const modelCtr = require("../controllers/model-controller");
const {
  userValidate,
  modelValidate,
  categoryValidate,
} = require("../middlewares/validation-middleware");
const { verifyToken } = require("../middlewares/auth-middleware");

const router = Router();

//cars



//categories

router.get("/get-categories/:id", modelCtr.GET_ONE_CATEGORY);

router.get("/get-categories", modelCtr.GET_CATEGORIES);

router.post("/add-category", categoryValidate, modelCtr.ADD_CATEGORY);
router.put("/update-category", modelCtr.UPDATE_CATEGORY);

router.delete("/delete-category", modelCtr.DELETE_CATEGORY);

module.exports = router;
