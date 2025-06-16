const express = require('express')
const router = express.Router()
const { ensureAdmin } = require('../middleware/auth')
const adminController = require('../controllers/adminController')
const uploadAttractionImage = require('../middleware/attractionUpload');

// Route to render the form for adding a new attraction
router.get('/new', ensureAdmin, adminController.renderNewAttractionForm);

// Route to handle the submission of the new attraction form with image upload
router.post('/', ensureAdmin, uploadAttractionImage.single('image'), adminController.createAttraction);

module.exports = router; 