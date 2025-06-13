const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

router.get('/', countryController.listCountries);
router.get('/:id', countryController.viewCountry);

module.exports = router;
