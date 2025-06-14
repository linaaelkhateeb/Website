const Booking = require('../models/booking');

// exports.getUserDashboard = async (req, res) => {
//     try {
//         const bookings = await Booking.find({ user: req.user._id }).populate('trip');
//         res.render('dashboards/clientDashboard', {
//             user: req.user,
//             bookings,
//         });
//     } catch (err) {
//         res.status(500).send('Error loading dashboard');
//     }
// };

// 
// exports.clientDashboard = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id }).populate('trip');

//     res.render('dashboards/clientDashboard', {
//       user: req.user,
//       bookings: bookings || [] // fallback to empty array
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error loading client dashboard');
//   }
// };

exports.clientDashboard = (req, res) => {
  res.render('dashboards/clientDashboard', {
    user: req.user,
    bookings: []  // temp placeholder since no booking logic yet
  });
};


