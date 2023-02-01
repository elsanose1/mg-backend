const router = require('express').Router()

const authController = require('../controllers/authController')


router.post('/login' , authController.login)
router.get('/logout',authController.logout)

router.use(authController.protect , authController.restrictTo('admin'))

router.get('/',authController.getAllUsers)
router.post('/createUser',authController.createUser)
router.patch('/update-user-password',authController.updatePassword)
router.route('/:id')
.patch(authController.updateUser)
.get(authController.getOneUser)
.delete(authController.deleteUser)


module.exports = router