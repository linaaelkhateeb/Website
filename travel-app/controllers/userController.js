const Booking = require('../models/booking');

exports.getUserDashboard = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('trip');
        res.render('dashboards/clientDashboard', {
            user: req.user,
            bookings,
        });
    } catch (err) {
        res.status(500).send('Error loading dashboard');
    }
};
