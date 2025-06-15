const Trip = require('../models/trips');

exports.bookTrip = async (req, res) => {
  try {
    const newBooking = await Booking.create({
      user: req.user._id,
      trip: req.body.tripId
    });

    res.redirect(`/payment?bookingId=${newBooking._id}`);
  } catch (err) {
    console.error('Booking failed:', err);
    res.redirect('/trips/search?error=Booking failed');
  }
};

