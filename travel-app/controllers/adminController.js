const User = require('../models/user');
const Trip = require('../models/trips');
const Location = require('../models/location');
const Country = require('../models/country');
const Category = require('../models/category');


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

    const recentTrips = await Trip.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .populate('country'); 

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
  trustedAgencies, // rename later
  totalTrips,      // Trips only
  totalLocations,  // Locations only
  totalCountries,
  recentUsers,
  recentTrips,
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




exports.approveTrip = async (req, res) => {
try {
await Trip.findByIdAndUpdate(req.params.id, { isApproved: true });
res.redirect('/admin/trips');
} catch (err) {
res.status(500).send('Error approving trip');
}
};

exports.rejectTrip = async (req, res) => {
try {
await Trip.findByIdAndDelete(req.params.id);
res.redirect('/admin/trips');
} catch (err) {
res.status(500).send('Error rejecting trip');
}
};

exports.getAllTrips = async (req, res) => {
  try {
    const agencyUsers = await User.find({ role: 'agency' }).select('_id');
    const agencyIds = agencyUsers.map(user => user._id);

    const pendingTrips = await Trip.find({
      isApproved: false,
      createdBy: { $in: agencyIds }
    }).populate('country category createdBy locations');

    const approvedTrips = await Trip.find({
      isApproved: true,
      createdBy: { $in: agencyIds }
    }).populate('country category createdBy locations');

    res.render('admin/trips/index', { pendingTrips, approvedTrips });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trips', error: err.message });
  }
};

// List all users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users/index', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// List all agencies
exports.listAgencies = async (req, res) => {
  try {
    const agencies = await User.find({ role: 'agency' });
    res.render('admin/agencies/index', { agencies });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


exports.deleteLocation = async (req, res) => {
  try {
    const locationId = req.params.id;
    await Location.findByIdAndDelete(locationId);
    req.flash('success_msg', 'Location removed successfully');
    res.redirect('/admin/locations');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting location');
    res.redirect('/admin/locations');
  }
};


// Mark as Trusted (API for AJAX)
exports.markAgencyTrusted = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isTrusted: true });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
//admin deleting agencies
exports.deleteAgency = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};


