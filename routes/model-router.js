const { Router } = require("express");
const modelCtr = require("../controllers/model-controller");
const {
  userValidate,
  modelValidate,
  categoryValidate,
} = require("../middlewares/validation-middleware");
const { verifyToken } = require("../middlewares/auth-middleware");

const router = Router();

//posts

router.get("/get-moderating-posts", modelCtr.GET_MODERATING_POSTS);
router.get("/get-active-posts", modelCtr.GET_ACTIVE_POSTS);
router.get("/search-active-posts", modelCtr.SEARCH_ACTIVE_POSTS);
router.get("/get-active-posts/:id", modelCtr.GET_ONE_ACTIVE_POST);
router.get("/get-rejected-posts", modelCtr.GET_REJECTED_POSTS);

//categories

router.get("/get-main-categories", modelCtr.GET_MAIN_CATEGORIES);

//

router.post("/add-category", categoryValidate, modelCtr.ADD_CATEGORY);
router.post("/moderate-post", modelCtr.MODERATE_POSTS);

module.exports = router;
