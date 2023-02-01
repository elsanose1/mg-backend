const router = require("express").Router();

const authController = require("../controllers/authController");
const clientController = require("../controllers/clientController");

// router.use(authController.protect)

router
  .route("/")
  .post(clientController.createClient)
  .get(clientController.getAll);

// router.use(authController.restrictTo('admin'))
router
  .route("/:id")
  .patch(clientController.updateClient)
  .get(clientController.getOne)
  .delete(clientController.deleteClient);

module.exports = router;
