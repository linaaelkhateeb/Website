const Location = require('../models/location');
const Country = require('../models/country');
const Category = require('../models/category');

exports.createLocation = async (req, res) => {
    try {
        const { name, description, country } = req.body;

        if (!name || !country) {
            return res.status(400).json({ message: 'Name and country are required' });
        }

        const location = new Location({
            name,
            description,
            country,
            createdBy: req.user._id,
            isApproved: req.user.isTrusted || false,
        });

        await location.save();

        res.status(201).json({
            message: req.user.isTrusted
                ? 'Location added and approved'
                : 'Location suggested, awaiting approval',
            location,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// Get approved countries
exports.getApprovedCountries = async (req, res) => {
    try {
        const countries = await Country.find({ isApproved: true });
        res.json(countries);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

