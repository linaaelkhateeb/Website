const Location = require('../models/location')
const Trip = require('../models/trips')
const Country = require('../models/country')
const Category = require('../models/category')
const User = require('../models/user')

//  CREATE LOCATION (with isTrusted check)
exports.createLocation = async (req, res) => {
    try {
        const { name, description, country } = req.body

        if (!name || !country) {
            return res
                .status(400)
                .json({ message: 'Name and country are required' })
        }

        const user = await User.findById(req.user._id)

        const location = new Location({
            name,
            description,
            country,
            createdBy: user._id,
            isApproved: user.isTrusted === true,
        })

        await location.save()

        res.status(201).json({
            message: user.isTrusted
                ? 'Location added and approved'
                : 'Location suggested, awaiting approval',
            location,
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

//  CREATE TRIP (with price and place)
exports.createTrip = async (req, res) => {
    try {
        const { title, description, country, category, price, place } = req.body

        if (!title || !country || !category || !price || !place) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const trip = new Trip({
            title,
            description,
            country,
            category,
            price,
            place,
            locations: locations || [],
            createdBy: req.user._id,
            isApproved: false,
        })

        await trip.save()

        res.status(201).json({
            message: 'Trip suggested, awaiting approval',
            trip,
        })
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create trip',
            error: err.message,
        })
    }
}

// GET APPROVED COUNTRIES
exports.getApprovedCountries = async (req, res) => {
    try {
        const countries = await Country.find({ isApproved: true })
        res.json(countries)
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

// GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.json(categories)
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}
