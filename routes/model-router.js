const { Router } = require("express");
const modelCtr = require("../controllers/model-controller");
const { modelValidate } = require("../middlewares/validation-middleware");
const { verifyToken } = require("../middlewares/auth-middleware");

const router = Router();

//cars

router.get("/get-categories/:id", modelCtr.GET_ONE_CATEGORY);

router.get("/get-categories", modelCtr.GET_CATEGORIES);

router.post("/add-model", modelValidate, modelCtr.ADD_MODEL);
router.put("/update-model", modelCtr.UPDATE_MODEL);

router.delete("/delete-category", modelCtr.DELETE_CATEGORY);

module.exports = router;
