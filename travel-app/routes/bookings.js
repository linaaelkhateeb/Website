const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { ensureAuth } = require('../middleware/auth');

router.post('/', ensureAuth, bookingController.bookTrip);

module.exports = router;
