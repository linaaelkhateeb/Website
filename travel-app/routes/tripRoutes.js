const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.get('/search', tripController.searchTrips); // ✅ This will now work

module.exports = router;
