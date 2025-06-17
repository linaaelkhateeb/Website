const User = require('../models/user');

const Trip = require('../models/trips')
const Country = require('../models/country');

exports.getAgencyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ createdBy: req.user._id }).populate('country category locations');
    res.render('agency/trips', {
      trips,
      user: req.user,
      success: req.flash('success'),
      error: req.flash('error'),
    });
  } catch (err) {
    res.status(500).render('agency/trips', {
      trips: [],
      error: 'Failed to load your trips',
      success: null,
    });
  }
};



//  AGENCY: Create a trip
// AGENCY: Create a trip
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
      startDate,
      endDate
    } = req.body;

    if (!title || !country || !category || !price || !city || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const now = new Date().setHours(0, 0, 0, 0);
    if (new Date(startDate) < now) {
      return res.status(400).json({ message: 'Start date must be today or later' });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    
    const imagePath = req.file
      ? `/uploads/${req.user._id}/${req.file.filename}`
      : '/images/default-trip.jpg';

    const trip = new Trip({
      title,
      description,
      country,
      category,
      locations: Array.isArray(locations) ? locations : [locations],
      price,
      city,
      startDate,
      endDate,
      createdBy: req.user._id,
      imageURL: imagePath,
      isApproved: false
    });

   await trip.save();
  req.flash('success', 'Trip submitted for approval.');
    res.redirect('/agency/trips'); 

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//  AGENCY: Get agency’s own trips
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
      startDate,
      endDate
    } = req.body;

    if (!title || !country || !category || !price || !city || !startDate || !endDate) {
      req.flash('error', 'Missing required fields');
      return res.redirect('/trips/new');
    }

    const now = new Date().setHours(0, 0, 0, 0);
    if (new Date(startDate) < now) {
      req.flash('error', 'Start date must be today or later');
      return res.redirect('/trips/new');
    }

    if (new Date(endDate) <= new Date(startDate)) {
      req.flash('error', 'End date must be after start date');
      return res.redirect('/trips/new');
    }

    const imagePath = req.file
      ? `/uploads/${req.user._id}/${req.file.filename}`
      : '/images/default-trip.jpg';

    const trip = new Trip({
      title,
      description,
      country,
      category,
      locations: Array.isArray(locations) ? locations : [locations],
      price,
      city,
      startDate,
      endDate,
      createdBy: req.user._id,
      imageURL: imagePath,
      isApproved: false,
    });

    await trip.save();

    req.flash('success', 'Trip submitted for approval');
   return  res.redirect('/agency/trips');
  } catch (err) {
    console.error('Trip submission error:', err);
    req.flash('error', 'Server error, please try again');
    res.redirect('/trips/new');
  }
};


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
      
    });
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create trip', error: err.message });
  }
};


// Agency: Submit a trip for approval

//  AGENCY: Get agency’s own trips



//  PUBLIC: Get trip by ID



//  ADMIN: Create trip directly

//  ADMIN: Approve trip
exports.approveTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!trip) {
      req.flash('error', 'Trip not found');
      return res.redirect('/admin/trips');
    }

    req.flash('success', 'Trip approved successfully!');
    res.redirect('/admin/trips'); // ✅ this sends admin back to the trip list view
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to approve trip');
    res.redirect('/admin/trips');
  }
};



//  ADMIN: Reject trip

exports.rejectTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    res.redirect('/admin/trips');
  } catch (err) {
    res.status(500).json({
      message: 'Failed to reject/delete trip',
      error: err.message,
    });
  }
}

exports.deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) return res.status(404).json({ message: 'Trip not found' });

    res.redirect('/admin/trips');
  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete trip',
      error: err.message,
    });
  }
};


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


const Location = require('../models/location');

exports.getLocationsByCountry = async (req, res) => {
  try {
    const locations = await Location.find({
      country: req.params.countryId,
      createdBy: req.user._id,
      isApproved: true
    });

    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load locations', error: err.message });
  }
};


