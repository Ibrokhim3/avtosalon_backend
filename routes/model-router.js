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

router.get("/get-active-posts/:id", modelCtr.GET_ONE_ACTIVE_POST);

//categories

router.get("/get-main-categories", modelCtr.GET_MAIN_CATEGORIES);

//

router.post("/add-category", categoryValidate, modelCtr.ADD_CATEGORY);
router.put("/update-category", modelCtr.UPDATE_CATEGORY);

router.delete("/delete-category", modelCtr.DELETE_CATEGORY);

module.exports = router;
