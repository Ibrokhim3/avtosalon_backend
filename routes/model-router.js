const { Router } = require("express");
const modelCtr = require("../controllers/model-controller");
const { modelValidate } = require("../middlewares/validation-middleware");
const { verifyToken } = require("../middlewares/auth-middleware");

const router = Router();

//cars

router.get("/get-models/:id", modelCtr.GET_MODELS_BY_CATEGORY);

router.get("/get-models", modelCtr.GET_MODELS);

router.post("/add-model", verifyToken, modelValidate, modelCtr.ADD_MODEL);

router.put("/update-model", verifyToken, modelCtr.UPDATE_MODEL);

router.delete("/delete-model", verifyToken, modelCtr.DELETE_MODEL);

module.exports = router;
