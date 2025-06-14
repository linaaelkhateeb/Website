const express = require('express');
const router = express.Router();
const attractionController = require('../controllers/attractionController');

router.get('/countries/:id/attractions', attractionController.getAttractionsByCountry);

module.exports = router;