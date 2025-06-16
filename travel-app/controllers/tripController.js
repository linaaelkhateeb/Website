const User = require('../models/user');

const Trip = require('../models/trips')
const Country = require('../models/country');

//  AGENCY: Create a trip
exports.agencyCreateTrip = async (req, res) => {
    try {
        const {
            title,
            description,
            country,
            category,
            locations,
            price,
            city,
            imageURL
        } = req.body

        if (!title || !country || !category || !price || !city) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        const trips = await Trip.find(filter).populate('country');
        const trip = new Trip({
            title,
            description,
            country,
            category,
            locations: locations || [],
            price,
            city,
            imageURL,
            createdBy: req.user._id,
            isApproved: false,
        })

        await trip.save()
        res.status(201).json({ message: 'Trip submitted for approval', trip })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

//  AGENCY: Get agency’s own trips
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
      imageURL
    });
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create trip', error: err.message });
  }
};

// Agency: Submit a trip for approval
exports.agencyCreateTrip = async (req, res) => {
    try {
        const {
            title,
            description,
            country,
            category,
            locations,
            price,
            city,
            imageURL
        } = req.body

        if (!title || !country || !category || !price || !city) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const trip = new Trip({
            title,
            description,
            country,
            category,
            locations: locations || [],
            price,
            city,
            createdBy: req.user._id,
            isApproved: false,
            imageURL
        })

        await trip.save()
        res.status(201).json({ message: 'Trip submitted for approval', trip })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

//  AGENCY: Get agency’s own trips
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


//  PUBLIC: Get trip by ID

exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate(
            'country category createdBy locations'
        )
        if (!trip) return res.status(404).json({ message: 'Trip not found' })
        res.json(trip)
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch trip',
            error: err.message,
        })
    }
}

//  ADMIN: Create trip directly
exports.createTrip = async (req, res) => {
    try {
        const {
            title,
            description,
            country,
            category,
            locations,
            price,
            city,
            imageURL,
            lat, 
            lng,
    
            
        } = req.body

        if (!title || !country || !category || !price || !city|| !lat || !lng) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const newTrip = new Trip({
            title,
            description,
            country,
            category,
            locations: locations || [],
            price,
            city,
            isApproved: true,
             coordinates: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
  
             },
             imageURL
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

//  ADMIN: Approve trip
exports.approveTrip = async (req, res) => {
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


//  ADMIN: Reject trip

exports.rejectTrip = async (req, res) => {
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

//  ADMIN: Get all trips
// Get trips submitted by agencies
exports.getAllTrips = async (req, res) => {
  try {
    const agencyUsers = await User.find({ role: 'agency' }).select('_id');
    const agencyIds = agencyUsers.map(user => user._id);

    const pendingTrips = await Trip.find({ isApproved: false, createdBy: { $in: agencyIds } })
      .populate('country category createdBy');
    const approvedTrips = await Trip.find({ isApproved: true, createdBy: { $in: agencyIds } })
      .populate('country category createdBy');

    res.render('admin/trips/index', {
      pendingTrips,
      approvedTrips
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trips', error: err.message });
  }
};

const Category = require('../models/category'); // make sure this is at the top

exports.searchTrips = async (req, res) => {
  const { location, category, priceMin, priceMax } = req.query;
  const filter = { isApproved: true };

  try {
    if (location) {
      const foundCountry = await Country.findOne({ name: { $regex: location, $options: 'i' } });
      if (foundCountry) {
        filter.country = foundCountry._id;
      } else {
        return res.render('trips/search', {
          trips: [],
          query: req.query,
          categories: [], // include if needed
          message: 'No trips found for that country.'
        });
      }
    }

    if (category) filter.category = category;
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = parseFloat(priceMin);
      if (priceMax) filter.price.$lte = parseFloat(priceMax);
    }

    const trips = await Trip.find(filter).populate('country category');
    res.render('trips/search', {
      trips,
      query: req.query,
      categories: [], // if you're using them
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('trips/search', {
      trips: [],
      query: req.query,
      categories: [],
      message: 'Server error'
    });
  }
};

