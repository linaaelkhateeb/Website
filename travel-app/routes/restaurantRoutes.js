const express = require('express')
const router = express.Router()
const controller = require('../controllers/restaurantController')
const ensureAgency = require('../middleware/ensureAgency')
const upload = require('../middleware/upload')

router.get('/', controller.getAllRestaurants)
router.get('/add', ensureAgency, controller.getAddRestaurantForm)
router.post(
    '/add',
    ensureAgency,
    upload.single('image'),
    controller.postAddRestaurant
)

module.exports = router
