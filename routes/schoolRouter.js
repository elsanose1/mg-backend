const router = require("express").Router();
const authController = require("../controllers/authController");
const schoolController = require("../controllers/schoolController");

router.get("/onlynames", schoolController.getNames);

router.use(authController.protect);

router
  .route("/")
  .post(schoolController.createSchool)
  .get(schoolController.getAll);

router
  .route("/:id")
  .patch(schoolController.updateSchool)
  .get(schoolController.getOne)
  .delete(authController.restrictTo("admin"), schoolController.deleteSchool);

module.exports = router;
