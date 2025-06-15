const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { ensureAuth } = require('../middleware/auth');

router.post('/', ensureAuth, bookingController.bookTrip);
router.get('/mybookings', ensureAuth, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('trip');
  res.render('mybookings', { bookings });
});

module.exports = router;
