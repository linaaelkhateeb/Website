const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

const bookingController = require('../controllers/bookingController');
const { ensureAuth } = require('../middleware/auth');

router.post('/', ensureAuth, async (req, res) => {
  const newBooking = await Booking.create({
    user: req.user._id,
    trip: req.body.tripId
  });
  res.redirect(`/payment?bookingId=${newBooking._id}`);
});

router.get('/mybookings', ensureAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('trip');
    res.render('mybookings', {
      bookings,
      success: req.query.success,
      error: req.query.error
    });
  } catch (err) {
    console.error('Failed to load mybookings:', err);
    res.status(500).send('Error loading bookings');
  }
});



module.exports = router;
