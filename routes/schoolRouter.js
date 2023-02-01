const router = require("express").Router();
const authController = require("../controllers/authController");
const schoolController = require("../controllers/schoolController");

router
  .route("/")
  .post(authController.protect, schoolController.createSchool)
  .get(authController.protect, schoolController.getAll);

// router.use()
router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    schoolController.updateSchool
  )
  .get(schoolController.getOne)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    schoolController.deleteSchool
  );

module.exports = router;
