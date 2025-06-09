const express = require('express')
const router = express.Router()
const Country = require('../models/country')
const { ensureAgency } = require('../middleware/roles');

// Suggest a country (pending approval)
router.post('/suggest', ensureAgency, async (req, res) => {
    try {
        const { name, description } = req.body
        const country = new Country({
            name,
            description,
            createdBy: req.user._id,
            isApproved: false,
        })
        await country.save()
        res.status(201).json({ message: 'Country suggestion submitted', country })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

module.exports = router
