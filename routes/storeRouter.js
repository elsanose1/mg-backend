const router = require("express").Router();

const authController = require("../controllers/authController");
const storeController = require("../controllers/storeController");

router
  .route("/")
  .post(authController.protect, storeController.createStore)
  .get(storeController.getAll);

router
  .route("/:id")
  .patch(authController.protect, storeController.updateStore)
  .get(storeController.getOne)
  .delete(authController.restrictTo("admin"), storeController.deleteStore);

module.exports = router;
