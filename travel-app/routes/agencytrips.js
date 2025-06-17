// // routes/agencytrips.js
// const express = require('express')
// const router = express.Router()
// const Trip = require('../models/trips')
// const ensureAgency = require('../middleware/ensureAgency')

// // Add a new trip (by an agency)
// router.post('/', ensureAgency, async (req, res) => {
//     try {
//         const { title, description, country, category, locations } = req.body

//         const trip = new Trip({
//             title,
//             description,
//             country,
//             category,
//             locations: locations || [],
//             createdBy: req.user._id,
//             isApproved: false,
//         })

//         await trip.save()
//         res.status(201).json({ message: 'Trip submitted for approval', trip })
//     } catch (err) {
//         console.error('[Trip Error]', err)
//         res.status(500).json({ message: 'Server error', error: err.message })
//     }
// })

// // Get trips submitted by the logged-in agency
// router.get('/mine', ensureAgency, async (req, res) => {
//     try {
//         const trips = await Trip.find({ createdBy: req.user._id }).populate(
//             'country category locations'
//         )
//         res.status(200).json(trips)
//     } catch (err) {
//         res.status(500).json({
//             message: 'Failed to fetch your trips',
//             error: err.message,
//         })
//     }
// })

// module.exports = router
const express = require('express');
const router = express.Router();
const ensureAgency = require('../middleware/ensureAgency');
const tripController = require('../controllers/tripController');
const agencyController = require('../controllers/agencyController');
const upload = require('../middleware/upload');

router.get('/mine', ensureAgency, tripController.getAgencyTrips);
// Show new trip form
router.get('/new', ensureAgency, agencyController.renderNewTripForm);
// Handle trip creation
router.post('/', ensureAgency, agencyController.createTrip);

router.post('/', ensureAgency, tripController.agencyCreateTrip);

router.get('/locations/by-country/:countryId', ensureAgency, tripController.getLocationsByCountry);



router.post('/new', ensureAgency, upload.single('image'), tripController.agencyCreateTrip);


module.exports = router;

