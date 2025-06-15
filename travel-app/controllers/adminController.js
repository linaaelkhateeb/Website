const User = require('../models/user');
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
    if (!location)
      return res.status(404).json({ message: 'Location not found' });
    res.json({ message: 'Location approved', location });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve location', error: err.message });
  }
};

// Reject a location
exports.rejectLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location)
      return res.status(404).json({ message: 'Location not found' });
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



// Get pending locations (not approved yet)
exports.getPendingLocations = async (req, res) => {
  try {
    const pendingLocations = await Location.find({ isApproved: false }).populate('country createdBy');
    res.render('admin/locations/index', { pendingLocations }); // 🟢 This now matches your view
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending locations', error: err.message });
  }
};
