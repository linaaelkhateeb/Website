// controllers/tripController.js
const Trip = require('../models/trips')

// ✅ Create a trip (AGENCY)
exports.agencyCreateTrip = async (req, res) => {
    try {
        const {
            title,
            description,
            country,
            category,
            locations,
            price,
            place,
        } = req.body

        if (!title || !country || !category || !price || !place) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const trip = new Trip({
            title,
            description,
            country,
            category,
            locations: locations || [],
            price,
            place,
            createdBy: req.user._id,
            isApproved: false,
        })

        await trip.save()
        res.status(201).json({ message: 'Trip submitted for approval', trip })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

// ✅ Get agency’s own trips
exports.getAgencyTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ createdBy: req.user._id }).populate(
            'country category locations'
        )
        res.status(200).json(trips)
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch your trips',
            error: err.message,
        })
    }
}

// ✅ Admin: Get all trips
// Public: Get all trips
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('country category createdBy locations');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trips', error: err.message });
  }
};
    try {
        const trips = await Trip.find().populate(
            'country category createdBy locations'
        )
        res.json(trips)
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch trips',
            error: err.message,
        })
    }
}

// Public: Get one trip by ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('country category createdBy locations');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trip', error: err.message });
  }
};

// Admin/Agency: Create a new trip (auto-approved)
// ✅ Admin: Create trip directly
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
    try {
        const {
            title,
            description,
            country,
            category,
            locations,
            price,
            place,
        } = req.body

        if (!title || !country || !category || !price || !place) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const newTrip = new Trip({
            title,
            description,
            country,
            category,
            locations: locations || [],
            price,
            place,
            isApproved: true,
        })

        await newTrip.save()
        res.status(201).json(newTrip)
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create trip',
            error: err.message,
        })
    }
}

// Agency: Submit a trip for approval
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
      isApproved: false,
    });
    await trip.save();
    res.status(201).json({ message: 'Trip submitted for approval', trip });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: Approve a trip
// ✅ Admin: Approve trip
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
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        )
        if (!trip) return res.status(404).json({ message: 'Trip not found' })
        res.json({ message: 'Trip approved', trip })
    } catch (err) {
        res.status(500).json({
            message: 'Failed to approve trip',
            error: err.message,
        })
    }
}

// Admin: Reject a trip
// ✅ Admin: Reject trip
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

// Agency: List trips created by this agency
exports.getAgencyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ createdBy: req.user._id })
      .populate('country category locations');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your trips', error: err.message });
  }
};

// Public or Authenticated: Search trips (renders HTML)
exports.searchTrips = async (req, res) => {
  const { location, category, priceMin, priceMax } = req.query;
  let filter = {};

  if (location) {
    filter.locations = { $in: [location] };
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
    const trips = await Trip.find(filter)
      .populate('country category createdBy locations');
    res.render('trips/search', { trips });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { isApproved: false },
            { new: true }
        )
        if (!trip) return res.status(404).json({ message: 'Trip not found' })
        res.json({ message: 'Trip rejected', trip })
    } catch (err) {
        res.status(500).json({
            message: 'Failed to reject trip',
            error: err.message,
        })
    }
}
