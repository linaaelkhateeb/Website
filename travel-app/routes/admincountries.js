const express = require('express')
const router = express.Router()
const Country = require('../models/country')

const { ensureAdmin } = require('../middleware/auth'); // ✅ CORRECT



// Create a new country
router.post('/', ensureAdmin, async (req, res) => {
    try {
        const { name, description } = req.body
        const country = new Country({ name, description, isApproved: true })
        await country.save()
        res.status(201).json(country)
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// List all countries
router.get('/', ensureAdmin, async (req, res) => {
    const countries = await Country.find()
    res.json(countries)
})

// Edit or approve country
router.patch('/:id', ensureAdmin, async (req, res) => {
    const updated = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
})

module.exports = router
