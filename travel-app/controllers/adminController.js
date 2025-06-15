const User = require('../models/user');
const Location = require('../models/location');
const Country = require('../models/country');
const Category = require('../models/category');
const Trip = require('../models/trips');

// Mark agency as trusted
exports.trustAgency = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isTrusted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Agency marked as trusted', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().populate('country createdBy');
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve locations', error: err.message });
  }
};

// Approve a location
exports.approveLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json({ message: 'Location approved', location });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve location', error: err.message });
  }
};

// Reject a location
exports.rejectLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json({ message: 'Location rejected and removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject location', error: err.message });
  }
};

// Create a new country
exports.createCountry = async (req, res) => {
  try {
    const { name, description } = req.body;
    const country = new Country({ name, description, isApproved: true });
    await country.save();
    res.status(201).json(country);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all countries
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve countries', error: err.message });
  }
};

// Update or approve a country
exports.updateCountry = async (req, res) => {
  try {
    const updated = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update country', error: err.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: 'Category added', category });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all categories
exports.getAllAdminCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin dashboard
exports.adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const trustedAgencies = await User.countDocuments({ role: 'agency', isTrusted: true });
    const totalTrips = await Trip.countDocuments();
    const totalLocations = await Location.countDocuments();
    const totalCountries = await Country.countDocuments();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const recentUsers = await User.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    }).sort({ createdAt: -1 });

    const tripsPerCountry = await Trip.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "countries",
          localField: "_id",
          foreignField: "_id",
          as: "countryInfo"
        }
      },
      { $unwind: "$countryInfo" },
      { $project: { _id: 0, country: "$countryInfo.name", count: 1 } }
    ]);

    const approvedTrips = await Trip.countDocuments({ isApproved: true });
    const pendingTrips = await Trip.countDocuments({ isApproved: false });
    const approvedLocations = await Location.countDocuments({ isApproved: true });
    const pendingLocations = await Location.countDocuments({ isApproved: false });

    res.render('dashboards/adminDashboard', {
      user: req.user,
      totalUsers,
      trustedAgencies,
      totalTrips: totalTrips + totalLocations,
      totalCountries,
      recentUsers,
      tripsPerCountry,
      approvedTrips,
      pendingTrips,
      approvedLocations,
      pendingLocations
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading admin dashboard');
  }
};

// Get pending and approved agency-submitted locations
exports.getPendingLocations = async (req, res) => {
  try {
    const agencyUsers = await User.find({ role: 'agency' }).select('_id');
    const agencyIds = agencyUsers.map(user => user._id);

    const pendingLocations = await Location.find({
      isApproved: false,
      createdBy: { $in: agencyIds }
    }).populate('country createdBy');

    const approvedAgencyLocations = await Location.find({
      isApproved: true,
      createdBy: { $in: agencyIds }
    }).populate('country createdBy');

    res.render('admin/locations/index', {
      pendingLocations,
      approvedLocations: approvedAgencyLocations
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch locations', error: err.message });
  }
};
