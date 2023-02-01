const router = require("express").Router();
const areaController = require("../controllers/areaController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.route("/").post(areaController.createArea).get(areaController.getAll);

router
  .route("/:id")
  .patch(areaController.updateArea)
  .get(areaController.getOne)
  .delete(areaController.deleteArea);

module.exports = router;
