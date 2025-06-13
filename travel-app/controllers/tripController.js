
const Trip = require('../models/trips');

// Get all trips
exports.getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find().populate('country category createdBy locations');
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch trips', error: err.message });
    }
};

// Create a new trip
exports.createTrip = async (req, res) => {
    try {
        const { title, description, country, category, locations } = req.body;

        const newTrip = new Trip({
            title,
            description,
            country,
            category,
            locations: locations || [],
            isApproved: true,
        });

        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create trip', error: err.message });
    }
};

// Approve a trip
exports.approveTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json({ message: 'Trip approved', trip });
    } catch (err) {
        res.status(500).json({ message: 'Failed to approve trip', error: err.message });
    }
};

// Reject a trip
exports.rejectTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { isApproved: false },
            { new: true }
        );
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json({ message: 'Trip rejected', trip });
    } catch (err) {
        res.status(500).json({ message: 'Failed to reject trip', error: err.message });
    }
};


// Create a trip by an agency (awaiting approval)
exports.agencyCreateTrip = async (req, res) => {
    try {
        const { title, description, country, category, locations } = req.body;

        const trip = new Trip({
            title,
            description,
            country,
            category,
            locations: locations || [],
            createdBy: req.user._id,
            isApproved: false, // pending approval
        });

        await trip.save();
        res.status(201).json({ message: 'Trip submitted for approval', trip });
    } catch (err) {
        console.error('[Trip Error]', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get trips created by the logged-in agency
exports.getAgencyTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ createdBy: req.user._id }).populate('country category locations');
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch your trips', error: err.message });
    }
const Trip = require('../models/trips'); // adjust if the model path is different

exports.searchTrips = async (req, res) => {
  const { location, category, priceMin, priceMax } = req.query;

  let filter = {};


  if (location) {
    filter.location = { $regex: location, $options: 'i' }; // case-insensitive match
  }

  if (category) {
    filter.category = category;
  }

  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = parseFloat(priceMin);
    if (priceMax) filter.price.$lte = parseFloat(priceMax);
  }

  try {
    const trips = await Trip.find(filter);
    res.render('trips/search', { trips });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }

}; }
