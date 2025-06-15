const Trip = require('../models/trips');
const Booking = require('../models/booking'); // you’ll create this model

exports.bookTrip = async (req, res) => {
  try {
    const { tripId } = req.body;
    const userId = req.user._id;

    const booking = new Booking({
      trip: tripId,
      user: userId,
    });

    await booking.save();
   res.redirect('/mybookings?success=Booking confirmed!');

  } catch (err) {
    console.error(err);
    res.status(500).send('Booking failed');
  }
};
